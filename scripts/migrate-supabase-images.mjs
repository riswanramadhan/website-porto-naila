import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

nextEnv.loadEnvConfig(process.cwd());

const applyChanges = process.argv.includes("--apply");
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const presets = {
  phone: { width: 900, height: 1950, quality: 80 },
  gallery: { width: 1800, height: 1800, quality: 78 },
  card: { width: 1200, height: 1200, quality: 78 },
  documentation: { width: 2000, height: 2000, quality: 80 },
  profile: { width: 640, height: 640, quality: 82 },
};
const purposeRank = { profile: 1, card: 2, phone: 3, gallery: 4, documentation: 5 };
const imageKeys = new Set(["src", "cardSrc", "detailSrc"]);

if (!supabaseUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for migration.");
}

const supabaseHost = new URL(supabaseUrl).hostname;
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const manifestDirectory = path.join(process.cwd(), "migration-backups");
const manifestPath = path.join(manifestDirectory, `${timestamp}-manifest.json`);

const isMigratableUrl = (value) => {
  if (typeof value !== "string" || !value.startsWith("https://")) return false;
  try {
    const url = new URL(value);
    return (
      url.hostname === supabaseHost &&
      url.pathname.includes("/storage/v1/object/public/") &&
      !url.pathname.includes("/optimized/")
    );
  } catch {
    return false;
  }
};

const getPurpose = ({ sectionKey, pathParts, itemType, imageKey }) => {
  if (sectionKey === "site_profile") return "profile";
  if (
    imageKey === "detailSrc" ||
    pathParts.includes("documentation") ||
    pathParts.includes("certificate")
  ) {
    return "documentation";
  }
  if (sectionKey === "editing") return itemType === "phone" ? "phone" : "gallery";
  return "card";
};

const collectImages = (value, context, output) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const itemType = context.sectionKey === "editing" ? item?.type : context.itemType;
      collectImages(item, { ...context, itemType, pathParts: [...context.pathParts, index] }, output);
    });
    return;
  }
  if (!value || typeof value !== "object") return;

  Object.entries(value).forEach(([key, child]) => {
    const pathParts = [...context.pathParts, key];
    if (imageKeys.has(key) && isMigratableUrl(child)) {
      output.push({
        url: child,
        sectionKey: context.sectionKey,
        path: pathParts.join("."),
        purpose: getPurpose({ ...context, pathParts, imageKey: key }),
      });
      return;
    }
    collectImages(child, { ...context, pathParts }, output);
  });
};

const parseStorageUrl = (value) => {
  const url = new URL(value);
  const marker = "/storage/v1/object/public/";
  const storagePath = decodeURIComponent(url.pathname.slice(url.pathname.indexOf(marker) + marker.length));
  const [bucket, ...objectParts] = storagePath.split("/");
  if (!bucket || !objectParts.length) throw new Error(`Invalid public storage URL: ${value}`);
  return { bucket, objectPath: objectParts.join("/") };
};

const replaceUrls = (value, mapping) => {
  if (Array.isArray(value)) return value.map((item) => replaceUrls(item, mapping));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      typeof child === "string" && mapping.has(child) ? mapping.get(child) : replaceUrls(child, mapping),
    ])
  );
};

await fs.mkdir(manifestDirectory, { recursive: true });

const { data: rows, error: rowsError } = await supabase
  .from("portfolio_content")
  .select("section_key, content, updated_at");

if (rowsError) throw new Error(rowsError.message);

const occurrences = [];
rows.forEach((row) =>
  collectImages(
    row.content,
    { sectionKey: row.section_key, itemType: null, pathParts: [row.section_key] },
    occurrences
  )
);

const jobsByUrl = new Map();
occurrences.forEach((occurrence) => {
  const current = jobsByUrl.get(occurrence.url);
  if (!current || purposeRank[occurrence.purpose] > purposeRank[current.purpose]) {
    jobsByUrl.set(occurrence.url, occurrence);
  }
});

const manifest = {
  createdAt: new Date().toISOString(),
  mode: applyChanges ? "apply" : "dry-run",
  databaseUpdated: false,
  originalRows: rows,
  occurrences,
  migrations: [],
};
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

if (!applyChanges) {
  console.log(`Dry run: ${jobsByUrl.size} unique images found.`);
  console.log(`Backup manifest: ${manifestPath}`);
  console.log("Run with --apply to upload WebP copies and update database URLs.");
} else {
  for (const job of jobsByUrl.values()) {
  const response = await fetch(job.url);
  if (!response.ok) throw new Error(`Failed to download ${job.url}: HTTP ${response.status}`);
  const originalBuffer = Buffer.from(await response.arrayBuffer());
  const preset = presets[job.purpose];
  const optimizedBuffer = await sharp(originalBuffer, { failOn: "error" })
    .rotate()
    .resize({
      width: preset.width,
      height: preset.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: preset.quality, effort: 5, smartSubsample: true })
    .toBuffer();
  const metadata = await sharp(optimizedBuffer).metadata();
  const { bucket } = parseStorageUrl(job.url);
  const digest = createHash("sha256").update(job.url).update(originalBuffer).digest("hex").slice(0, 18);
  const sectionFolder = String(job.sectionKey).replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
  const objectPath = `optimized/${sectionFolder}/${digest}.webp`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, optimizedBuffer, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError && !String(uploadError.message).toLowerCase().includes("already exists")) {
    throw new Error(`Upload failed for ${job.url}: ${uploadError.message}`);
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  manifest.migrations.push({
    from: job.url,
    to: publicUrl.publicUrl,
    bucket,
    path: objectPath,
    sectionKey: job.sectionKey,
    purpose: job.purpose,
    originalBytes: originalBuffer.byteLength,
    optimizedBytes: optimizedBuffer.byteLength,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`${manifest.migrations.length}/${jobsByUrl.size} ${job.sectionKey}: ${originalBuffer.byteLength} -> ${optimizedBuffer.byteLength}`);
}

const mapping = new Map(manifest.migrations.map((item) => [item.from, item.to]));
const updatedRows = rows.map((row) => ({
  section_key: row.section_key,
  content: replaceUrls(row.content, mapping),
  updated_at: new Date().toISOString(),
}));

const { error: updateError } = await supabase
  .from("portfolio_content")
  .upsert(updatedRows, { onConflict: "section_key" });

if (updateError) throw new Error(`Database update failed: ${updateError.message}`);

manifest.databaseUpdated = true;
manifest.completedAt = new Date().toISOString();
manifest.totalOriginalBytes = manifest.migrations.reduce((total, item) => total + item.originalBytes, 0);
manifest.totalOptimizedBytes = manifest.migrations.reduce((total, item) => total + item.optimizedBytes, 0);
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Migrated ${manifest.migrations.length} unique images.`);
  console.log(`Backup manifest: ${manifestPath}`);
  console.log(`${manifest.totalOriginalBytes} bytes -> ${manifest.totalOptimizedBytes} bytes.`);
}
