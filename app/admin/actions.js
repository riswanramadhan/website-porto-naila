"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseKeyMode, replacePortfolio, replaceSiteProfile } from "@/lib/portfolio";

const sectionKeys = ["experiences", "projects", "news", "achievements"];
const formatError = (message) => ({ status: "error", message });
const formatRlsError = () =>
  formatError(
    "Penyimpanan belum tersedia. Silakan hubungi pengelola situs."
  );

export async function updatePortfolio(previousState, formData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  if (getSupabaseKeyMode() !== "service") {
    return formatError(
      "Penyimpanan belum tersedia. Silakan hubungi pengelola situs."
    );
  }

  const payload = {};

  for (const sectionKey of sectionKeys) {
    const rawPayload = formData.get(sectionKey);
    if (typeof rawPayload !== "string" || !rawPayload.trim()) {
      return formatError(`Data ${sectionKey} wajib diisi.`);
    }

    try {
      payload[sectionKey] = JSON.parse(rawPayload);
    } catch (error) {
      return formatError(`Format data ${sectionKey} tidak valid. Periksa kembali isian Anda.`);
    }

    if (!Array.isArray(payload[sectionKey])) {
      return formatError(`Format data ${sectionKey} tidak sesuai.`);
    }
  }

  const result = await replacePortfolio(payload);
  if (!result.ok) {
    if (String(result.error || "").toLowerCase().includes("row-level security")) {
      return formatRlsError();
    }
    return formatError("Gagal menyimpan perubahan. Silakan coba lagi.");
  }

  let profile;
  try {
    profile = JSON.parse(String(formData.get("siteProfile") ?? "{}"));
  } catch (error) {
    return formatError("Format data profile navbar tidak valid.");
  }

  const profileResult = await replaceSiteProfile(profile);
  if (!profileResult.ok) {
    return formatError(profileResult.error || "Gagal menyimpan profile navbar.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/achievements/[slug]", "page");

  return { status: "success", message: "Perubahan berhasil disimpan." };
}
