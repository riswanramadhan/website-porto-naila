"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function loginAdmin(previousState, formData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    return {
      status: "error",
      message: "Username atau password tidak sesuai.",
    };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
