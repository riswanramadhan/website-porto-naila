import {
  getProfileStorageBucket,
  getSupabaseAdminClient,
  getSupabaseKeyMode,
  getSupabaseStorageBucket,
} from "@/lib/portfolio";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Buffer } from "node:buffer";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const PURPOSE_PRESETS = {
  phone: { width: 900, height: 1950, quality: 80 },
  gallery: { width: 1800, height: 1800, quality: 78 },
  card: { width: 1200, height: 1200, quality: 78 },
  documentation: { width: 2000, height: 2000, quality: 80 },
  profile: { width: 640, height: 640, quality: 82 },
};
const WebResponse = globalThis.Response;
const WebFile = globalThis.File;
const webCrypto = globalThis.crypto;

const slugify = (value) =>
  String(value || "upload")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "upload";

const ensureBucket = async (supabase, bucketName) => {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) return { error: listError.message };

  const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
  if (bucketExists) return { ok: true };

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
  });

  if (createError) return { error: createError.message };

  return { ok: true };
};

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return WebResponse.json({ ok: false, error: "Silakan masuk kembali untuk melanjutkan." }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const keyMode = getSupabaseKeyMode();
  if (!supabase) {
    return WebResponse.json(
      {
        ok: false,
        error:
          "Supabase is not configured for uploads. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_PUBLISHABLE_KEY.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = slugify(formData.get("folder"));
  const prefix = slugify(formData.get("prefix"));
  const uploadArea = String(formData.get("bucket") ?? "content");
  const purpose = String(formData.get("purpose") ?? (uploadArea === "profile" ? "profile" : "card"));

  if (!(file instanceof WebFile)) {
    return WebResponse.json({ ok: false, error: "An image file is required." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return WebResponse.json(
      {
        ok: false,
        error: "Only JPG, PNG, WebP, GIF, or AVIF images are allowed.",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return WebResponse.json(
      {
        ok: false,
        error: "Image size must be 10MB or smaller.",
      },
      { status: 400 }
    );
  }

  if (!(purpose in PURPOSE_PRESETS)) {
    return WebResponse.json(
      { ok: false, error: "Invalid image purpose." },
      { status: 400 }
    );
  }

  const bucketName = uploadArea === "profile" ? getProfileStorageBucket() : getSupabaseStorageBucket();
  if (keyMode === "service") {
    const bucketState = await ensureBucket(supabase, bucketName);
    if (bucketState.error) {
      return WebResponse.json({ ok: false, error: bucketState.error }, { status: 500 });
    }
  } else {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      return WebResponse.json(
        {
          ok: false,
          error:
            "Bucket check failed. Use SUPABASE_SERVICE_ROLE_KEY or add storage policies for the anon key.",
        },
        { status: 403 }
      );
    }
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
    if (!bucketExists) {
      return WebResponse.json(
        {
          ok: false,
          error: `Bucket '${bucketName}' not found. Create it in Supabase Storage first.`,
        },
        { status: 404 }
      );
    }
  }

  const fileStem = slugify(file.name.replace(/\.[^.]+$/, ""));
  const preset = PURPOSE_PRESETS[purpose];
  let optimizedBuffer;

  try {
    optimizedBuffer = await sharp(Buffer.from(await file.arrayBuffer()), { failOn: "error" })
      .rotate()
      .resize({
        width: preset.width,
        height: preset.height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: preset.quality, effort: 4, smartSubsample: true })
      .toBuffer();
  } catch {
    return WebResponse.json(
      { ok: false, error: "The image could not be processed." },
      { status: 400 }
    );
  }

  const metadata = await sharp(optimizedBuffer).metadata();
  const objectPath = [folder, prefix, `${Date.now()}-${webCrypto.randomUUID()}-${fileStem}.webp`]
    .filter(Boolean)
    .join("/");

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(objectPath, optimizedBuffer, {
    cacheControl: "31536000",
    upsert: false,
    contentType: "image/webp",
  });

  if (uploadError) {
    return WebResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

  return WebResponse.json({
    ok: true,
    bucket: bucketName,
    path: objectPath,
    url: data.publicUrl,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    size: optimizedBuffer.byteLength,
    contentType: "image/webp",
  });
}
