import { redirect } from "next/navigation";
import ClientInteractions from "@/components/ClientInteractions";
import GlobalDecor from "@/components/GlobalDecor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login Admin | Naila Azahra",
  description: "Login aman untuk mengelola portfolio Naila Azahra.",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <>
      <GlobalDecor />
      <main className="admin-login-page">
        <div className="admin-login-shell">
          <aside className="admin-login-showcase" aria-label="Portfolio admin">
            <span className="admin-login-brand">NA</span>
            <div>
              <p className="eyebrow">Portfolio workspace</p>
              <h2>Satu ruang untuk menjaga cerita terbaik Anda tetap rapi.</h2>
            </div>
            <div className="admin-login-features">
              <p>Kelola pencapaian dan sertifikat</p>
              <p>Perbarui proyek dan pengalaman</p>
              <p>Publikasikan konten dengan percaya diri</p>
            </div>
          </aside>
          <LoginForm />
        </div>
      </main>
      <ClientInteractions />
    </>
  );
}
