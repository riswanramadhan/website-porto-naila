import AdminForm from "./AdminForm";
import { redirect } from "next/navigation";
import ClientInteractions from "@/components/ClientInteractions";
import GlobalDecor from "@/components/GlobalDecor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  fetchContactMessages,
  fetchPortfolio,
  fetchSiteProfile,
  getSupabaseKeyMode,
  isSupabaseConfigured,
} from "@/lib/portfolio";

export const metadata = {
  title: "Admin | Naila Azahra",
  description: "Admin panel for managing portfolio content.",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [portfolio, profile, messages] = await Promise.all([
    fetchPortfolio(),
    fetchSiteProfile(),
    fetchContactMessages(),
  ]);
  const supabaseMode = getSupabaseKeyMode();
  const supabaseReady = isSupabaseConfigured();

  return (
    <>
      <GlobalDecor />
      <main className="admin-page">
        <section className="section" id="admin">
          <div className="container">
            <AdminForm
              initialPortfolio={portfolio}
              initialProfile={profile}
              initialMessages={messages}
              supabaseReady={supabaseReady}
              supabaseMode={supabaseMode}
            />
          </div>
        </section>
      </main>

      <ClientInteractions />
    </>
  );
}
