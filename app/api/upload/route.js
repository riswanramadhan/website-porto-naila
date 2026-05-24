import {
  getProfileStorageBucket,
  getSupabaseAdminClient,
  getSupabaseKeyMode,
  getSupabaseStorageBucket,
} from "@/lib/portfolio";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const WebResponse = globalThis.Response;
const WebFile = globalThis.File;
const webCrypto = globalThis.crypto;

const slugify = (value) =>
  String(value || "upload")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "upload";

const extensionFromFile = (file) => {
  const fileName = file?.name || "";
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  if (match?.[1]) return match[1].toLowerCase();

  const mimeMap = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };

  return mimeMap[file?.type] || "bin";
};

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
  const extension = extensionFromFile(file);
  const objectPath = [folder, prefix, `${Date.now()}-${webCrypto.randomUUID()}-${fileStem}.${extension}`]
    .filter(Boolean)
    .join("/");

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
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
  });
}
