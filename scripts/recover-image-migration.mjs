import fs from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

nextEnv.loadEnvConfig(process.cwd());

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) throw new Error("Supabase service credentials are required.");

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const imageKeys = new Set(["src", "cardSrc", "detailSrc"]);
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDirectory = path.join(process.cwd(), "migration-backups");
const backupPath = path.join(backupDirectory, `${timestamp}-recovered-manifest.json`);

const collectOptimizedUrls = (value, output = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectOptimizedUrls(item, output));
    return output;
  }
  if (!value || typeof value !== "object") return output;
  Object.entries(value).forEach(([key, child]) => {
    if (
      imageKeys.has(key) &&
      typeof child === "string" &&
      child.includes("/storage/v1/object/public/") &&
      child.includes("/optimized/")
    ) {
      output.push(child);
    } else {
      collectOptimizedUrls(child, output);
    }
  });
  return output;
};

const parseStorageUrl = (value) => {
  const url = new URL(value);
  const marker = "/storage/v1/object/public/";
  const storagePath = decodeURIComponent(url.pathname.slice(url.pathname.indexOf(marker) + marker.length));
  const [bucket, ...objectParts] = storagePath.split("/");
  return { bucket, objectPath: objectParts.join("/") };
};

const listFiles = async (bucket, prefix = "") => {
  const files = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`${bucket}/${prefix}: ${error.message}`);
    if (!data?.length) break;
    for (const item of data) {
      const objectPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id) files.push(objectPath);
      else files.push(...(await listFiles(bucket, objectPath)));
    }
    if (data.length < 100) break;
    offset += data.length;
  }
  return files;
};

const download = async (bucket, objectPath) => {
  const { data, error } = await supabase.storage.from(bucket).download(objectPath);
  if (error) throw new Error(`${bucket}/${objectPath}: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
};

const fingerprint = async (buffer) => {
  const source = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await source.metadata();
  const pixels = await source
    .clone()
    .resize(32, 32, { fit: "fill" })
    .flatten({ background: "#ffffff" })
    .greyscale()
    .raw()
    .toBuffer();
  return {
    pixels,
    aspect: metadata.width && metadata.height ? metadata.width / metadata.height : 1,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  };
};

const imageScore = (left, right) => {
  let squaredError = 0;
  for (let index = 0; index < left.length; index += 1) {
    const difference = left[index] - right[index];
    squaredError += difference * difference;
  }
  return Math.sqrt(squaredError / left.length) / 255;
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

const { data: rows, error: rowsError } = await supabase
  .from("portfolio_content")
  .select("section_key, content, updated_at");
if (rowsError) throw new Error(rowsError.message);

const optimizedUrls = [...new Set(rows.flatMap((row) => collectOptimizedUrls(row.content)))];
const buckets = [...new Set(optimizedUrls.map((url) => parseStorageUrl(url).bucket))];
const candidates = [];

for (const bucket of buckets) {
  const objectPaths = await listFiles(bucket);
  for (const objectPath of objectPaths.filter((item) => !item.startsWith("optimized/"))) {
    try {
      const buffer = await download(bucket, objectPath);
      candidates.push({ bucket, objectPath, bytes: buffer.byteLength, ...(await fingerprint(buffer)) });
    } catch (error) {
      console.warn(`Skipped ${bucket}/${objectPath}: ${error.message}`);
    }
  }
}

const mappings = [];
for (const [index, optimizedUrl] of optimizedUrls.entries()) {
  const { bucket, objectPath } = parseStorageUrl(optimizedUrl);
  const optimizedBuffer = await download(bucket, objectPath);
  const optimizedFingerprint = await fingerprint(optimizedBuffer);
  const sameBucket = candidates.filter((candidate) => candidate.bucket === bucket);
  const aspectMatches = sameBucket.filter(
    (candidate) => Math.abs(candidate.aspect - optimizedFingerprint.aspect) <= 0.035
  );
  const pool = aspectMatches.length ? aspectMatches : sameBucket;
  const best = pool
    .map((candidate) => ({
      candidate,
      score: imageScore(optimizedFingerprint.pixels, candidate.pixels),
    }))
    .sort((left, right) => left.score - right.score)[0];
  if (!best) throw new Error(`No original candidate found for ${optimizedUrl}`);
  const { data: originalPublicUrl } = supabase.storage
    .from(best.candidate.bucket)
    .getPublicUrl(best.candidate.objectPath);
  mappings.push({
    from: originalPublicUrl.publicUrl,
    to: optimizedUrl,
    score: best.score,
    originalBytes: best.candidate.bytes,
    optimizedBytes: optimizedBuffer.byteLength,
    bucket,
    originalPath: best.candidate.objectPath,
    optimizedPath: objectPath,
  });
  console.log(`${index + 1}/${optimizedUrls.length} score=${best.score.toFixed(4)} ${objectPath}`);
}

const rollbackMapping = new Map(mappings.map((item) => [item.to, item.from]));
const manifest = {
  recoveredAt: new Date().toISOString(),
  note: "Recovered after the original temporary manifest was removed by next build.",
  databaseUpdated: true,
  mappings,
  currentRows: rows,
  originalRows: rows.map((row) => ({ ...row, content: replaceUrls(row.content, rollbackMapping) })),
};
await fs.mkdir(backupDirectory, { recursive: true });
await fs.writeFile(backupPath, JSON.stringify(manifest, null, 2));
console.log(`Recovered manifest: ${backupPath}`);
