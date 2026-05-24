import { notFound } from "next/navigation";
import ClientInteractions from "@/components/ClientInteractions";
import GlobalDecor from "@/components/GlobalDecor";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import AchievementMediaGallery from "@/components/AchievementMediaGallery";
import { fetchAchievementBySlug } from "@/lib/achievements";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const achievement = await fetchAchievementBySlug(slug);
  if (!achievement) {
    return {
      title: "Achievement Not Found",
    };
  }

  return {
    title: `${achievement.title} | Achievement`,
    description: `Achievement details for ${achievement.title}.`,
  };
}

export default async function AchievementPage({ params }) {
  const { slug } = await params;
  const achievement = await fetchAchievementBySlug(slug);
  if (!achievement) {
    notFound();
  }

  const documentationItems = Array.isArray(achievement.documentation)
    ? achievement.documentation
    : [];
  const certificateItems = Array.isArray(achievement.certificate)
    ? achievement.certificate
    : achievement.certificate
      ? [achievement.certificate]
      : [];

  return (
    <>
      <GlobalDecor />
      <SiteHeader />

      <main>
        <section className="section achievement-hero" id="achievement">
          <div className="container achievement-hero-grid">
            <div className="achievement-header reveal">
              <p className="eyebrow">Achievement</p>
              <h1>{achievement.title}</h1>
              <p className="achievement-lead">{achievement.lead}</p>
              <div className="achievement-meta">
                {(achievement.meta ?? []).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="hero-actions" aria-label="Achievement actions">
                <a className="button button-secondary" href="/#achievements">
                  Back to achievements
                </a>
                <a className="button button-primary" href="/#contact" data-i18n="contactMe">
                  Contact Me
                </a>
              </div>
            </div>
            <div className="achievement-hero-media reveal">
              {achievement.image ? <img src={achievement.image.src} alt={achievement.image.alt} /> : null}
            </div>
          </div>
        </section>

        <section className="section achievement-details">
          <div className="container achievement-detail-grid">
            <article className="achievement-media-section reveal">
              <h2>Documentation</h2>
              <div className="achievement-copy-block">
                <p>{achievement.documentationBody}</p>
                <AchievementMediaGallery items={documentationItems} />
              </div>
            </article>

            <article className="achievement-media-section reveal">
              <h2>Certificate</h2>
              <div className="achievement-copy-block">
                <p>{achievement.certificateBody}</p>
                <AchievementMediaGallery items={certificateItems} className="certificate-grid" />
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter backTopHref="#achievement" />
      <ClientInteractions />
    </>
  );
}
