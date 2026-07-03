import ClientInteractions from "@/components/ClientInteractions";
import GlobalDecor from "@/components/GlobalDecor";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ContactForm from "@/components/ContactForm";
import { Lightbox } from "@/components/Lightbox";
import NewsCarousel from "@/components/NewsCarousel";
import ProjectCard from "@/components/ProjectCard";
import { fetchPortfolio } from "@/lib/portfolio";
import { optimizedImageProps } from "@/lib/image";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";

const imageLogoBrands = new Set([
  "spss",
  "rstudio",
  "figma",
  "photoshop",
  "canva",
]);
const heroImageSrc = "/naila-hero.webp";
const heroStatIcons = [
  <svg viewBox="0 0 24 24" aria-hidden="true" key="people">
    <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z" />
  </svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true" key="team">
    <path d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 5.76 2.88L12 9.96 6.24 7.08 12 4.2Zm-7 4.5 6 3v7.8l-6-3V8.7Zm8 10.8v-7.8l6-3v7.8l-6 3Z" />
  </svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true" key="heart">
    <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Zm0-2.45c2.05-1.43 5-4.35 5-7.55a2 2 0 0 0-3.55-1.26L12 11.52l-1.45-1.78A2 2 0 0 0 7 11c0 3.2 2.95 6.12 5 7.55Z" />
  </svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true" key="growth">
    <path d="M4 18h16v2H4v-2Zm1-3.5 4.5-4.5 3 3L19 6.5V11h2V3h-8v2h4.5l-5 5-3-3L3.6 12.9 5 14.5Z" />
  </svg>,
];

const getMediaStyle = (image = {}) => {
  const focus = image.focus ?? {};
  const parsePercent = (value, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(100, Math.max(0, numeric));
  };
  const x = parsePercent(focus.x, 50);
  const y = parsePercent(focus.y, 50);
  return {
    "--media-focus-x": `${x}%`,
    "--media-focus-y": `${y}%`,
  };
};

const getCardImageSrc = (image = {}) => image.cardSrc || image.src;
const getProjectSummary = (project = {}) =>
  project.summary ||
  [project.problem, project.solution, project.impact].filter(Boolean).join(" ");
const getProjectSummaryPreview = (project = {}) => {
  const summary = getProjectSummary(project).trim();
  const words = summary.split(/\s+/).filter(Boolean);
  return {
    full: summary,
    isLong: words.length > 16,
    preview: words.length > 16 ? `${words.slice(0, 16).join(" ")}...` : summary,
  };
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.94 8.98H3.96V20h2.98V8.98ZM5.45 4a1.73 1.73 0 1 0 0 3.46 1.73 1.73 0 0 0 0-3.46Zm5.24 4.98H7.84V20h2.98v-5.45c0-1.44.27-2.83 2.05-2.83 1.76 0 1.78 1.64 1.78 2.92V20h2.98v-6.04c0-2.96-.64-5.24-4.1-5.24a3.59 3.59 0 0 0-3.23 1.78h-.04l.43-1.52Z" />
    </svg>
  );
}

function SkillLogo({ brand }) {
  const imageLogos = {
    spss: "/logo-spss.webp",
    rstudio: "/logo-rstudio.webp",
    figma: "/logo-figma.webp",
    photoshop: "/logo-photoshop.webp",
    canva: "/logo-canva.webp",
  };
  const imageSrc = imageLogos[brand];
  if (imageSrc) {
    return (
      <Image
        className="skill-logo-image"
        src={imageSrc}
        alt={`${brand} logo`}
        width={128}
        height={128}
        sizes="64px"
        {...optimizedImageProps}
      />
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="8" width="48" height="48" rx="16" fill="#001e36" />
      <path
        d="M22 43V21h9.1c4.1 0 6.9 2.7 6.9 6.6 0 4-2.8 6.7-6.9 6.7H27v8h-5Zm5-12h3.4c1.9 0 3-1 3-2.7 0-1.6-1.1-2.6-3-2.6H27v5.3Zm16 12V28h4.3v3.1h.1c.8-2.2 2.5-3.5 4.9-3.5.5 0 .9 0 1.2.1v4.3c-.4-.1-1.1-.2-1.8-.2-2.6 0-4.4 1.5-4.4 4.2V43h-4.3Z"
        fill="#31a8ff"
      />
    </svg>
  );
}

export default async function Home() {
  const { achievements, communityProjects, editing, experiences, hero, heroStats, news, projects } =
    await fetchPortfolio();
  const activeHeroStats = heroStats
    .filter((item) => item.isActive !== false)
    .slice(0, 4);
  const activeExperiences = experiences.filter(
    (item) => item.isActive !== false,
  );
  const activeProjects = projects.filter((item) => item.isActive !== false);
  const activeCommunityProjects = communityProjects.filter(
    (item) => item.isActive !== false,
  );
  const featuredCommunityProject = activeCommunityProjects[0];
  const activeEditing = editing.filter((item) => item.isActive !== false);
  const activeNews = news.filter((item) => item.isActive !== false);
  const activeAchievements = achievements.filter(
    (item) => item.isActive !== false,
  );
  const phoneEditingItems = activeEditing
    .filter((item) => item.type === "phone")
    .slice(0, 2);
  const galleryEditingItems = activeEditing.filter(
    (item) => item.type !== "phone",
  );
  const skillCards = [
    {
      title: "Soft Skills",
      titleKey: "skillsSoftSkills",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.57-6 3.5V20h12v-2.5c0-1.93-2.69-3.5-6-3.5Z" />
        </svg>
      ),
      items: ["Leadership", "Communication", "Negotiation", "Recruitment"],
      type: "chips",
    },
    {
      title: "Analytics",
      titleKey: "skillsAnalytics",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19h16v2H4v-2Zm2-2h3V9H6v8Zm5 0h3V4h-3v13Zm5 0h3v-6h-3v6Z" />
        </svg>
      ),
      items: [
        { name: "SPSS", brand: "spss" },
        { name: "R Studio", brand: "rstudio" },
      ],
      type: "logos",
    },
    {
      title: "Creative",
      titleKey: "skillsCreative",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3h10a4 4 0 0 1 0 8h-2v2h2a4 4 0 1 1-4 4v-4h-2v4a4 4 0 1 1-4-4h2v-2H7A4 4 0 0 1 7 3Zm0 2a2 2 0 1 0 0 4h2V5H7Zm6 0v4h4a2 2 0 1 0 0-4h-4Zm-6 10a2 2 0 1 0 2 2v-2H7Zm8 0v2a2 2 0 1 0 2-2h-2Z" />
        </svg>
      ),
      items: [
        { name: "Figma", brand: "figma" },
        { name: "Canva", brand: "canva" },
        { name: "Photoshop", brand: "photoshop" },
      ],
      type: "logos",
    },
    {
      title: "Language",
      titleKey: "skillsLanguage",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm7.93 9h-3.17a15.72 15.72 0 0 0-1.1-4.1A8.03 8.03 0 0 1 19.93 11ZM12 4c.86 1.06 1.7 2.73 2.28 5H9.72C10.3 6.73 11.14 5.06 12 4Zm-2.64 0A15.72 15.72 0 0 0 8.26 11H4.07a8.03 8.03 0 0 1 5.29-7Zm-5.29 9h4.19a15.72 15.72 0 0 0 1.1 4.1A8.03 8.03 0 0 1 4.07 13ZM12 20c-.86-1.06-1.7-2.73-2.28-5h4.56c-.58 2.27-1.42 3.94-2.28 5Zm2.64-.9A15.72 15.72 0 0 0 15.74 13h4.19a8.03 8.03 0 0 1-5.29 7ZM9.72 13h4.56A15.72 15.72 0 0 1 12 17.9 15.72 15.72 0 0 1 9.72 13Z" />
        </svg>
      ),
      items: [
        { label: "Bahasa Indonesia", detail: "Native", detailKey: "skillsBahasaNative" },
        {
          label: "English",
          detail: "Professional Working Proficiency",
          detailKey: "skillsEnglishProfessional",
        },
      ],
      type: "languages",
    },
    {
      title: "HR Tools",
      titleKey: "skillsHrTools",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5h14v14H5V5Zm2 2v10h10V7H7Zm2 2h6v2H9V9Zm0 4h4v2H9v-2Z" />
        </svg>
      ),
      items: ["ATS", "KPI", "HRIS", "Performance Tracking"],
      type: "chips",
    },
  ];

  return (
    <>
      <GlobalDecor />
      <SiteHeader />

      <main>
        <section className="hero section" id="home">
          <div className="hero-glow" aria-hidden="true"></div>
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="hero-typing">
                <p className="eyebrow hero-eyebrow typing" data-typing="hero">
                  <span className="sr-only" data-i18n="heroEyebrow">
                    Psychology / HR / Leadership
                  </span>
                  <span className="typing-text" aria-hidden="true">
                    Psychology / HR / Leadership
                  </span>
                </p>
              </div>
              <h1 className="hero-title" data-i18n="heroTitle">
                Helping people grow through psychology, leadership, and talent
                development.
              </h1>
              <p className="hero-lead" data-i18n="heroLead">
                Aspiring HR professional with experience in recruitment, talent
                management, and project leadership.
              </p>
              <div className="hero-actions" aria-label="Primary actions">
                <a
                  className="button button-primary"
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Naila Azahra resume"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 3h7l4 4v14H7V3Zm7 1.8V8h3.2L14 4.8ZM9 12h6v1.5H9V12Zm0 4h6v1.5H9V16Z" />
                  </svg>
                  <span data-i18n="viewResume">View Resume</span>
                </a>
                <a className="button button-secondary" href="#contact">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16v12H4V6Zm2.2 2 5.8 4.35L17.8 8H6.2Zm11.8 8V9.9l-6 4.5-6-4.5V16h12Z" />
                  </svg>
                  <span data-i18n="contactMe">Contact Me</span>
                </a>
              </div>
            </div>

            <div
              className="hero-visual reveal"
              aria-label="Portrait and impact metrics"
            >
              <div className="hero-image-frame">
                <Image
                  className="hero-image"
                  src={heroImageSrc}
                  alt="Naila Azahra portrait"
                  width={900}
                  height={1350}
                  sizes="(max-width: 960px) 600px, 40vw"
                  preload
                  {...optimizedImageProps}
                />
              </div>
              <div
                className="hero-metrics"
                aria-label="Portfolio impact statistics"
              >
                {activeHeroStats.map((stat, index) => {
                  const numericValue = Number(stat.value);
                  const countValue = Number.isFinite(numericValue) ? numericValue : 0;
                  const suffix = stat.suffix ?? "";

                  return (
                    <article
                      className={`stat-card hero-stat hero-stat-${index + 1}`}
                      key={stat.id ?? `${stat.label}-${index}`}
                    >
                      <span className="stat-icon">
                        {heroStatIcons[index] ?? heroStatIcons[0]}
                      </span>
                      <strong data-count={countValue} data-count-suffix={suffix}>
                        {countValue}
                        {suffix}
                      </strong>
                      <span
                        data-lang-en={stat.label}
                        data-lang-id={stat.labelId || stat.label}
                      >
                        {stat.label}
                      </span>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="aboutEyebrow">
                About
              </p>
              <h2 data-i18n="aboutTitle">
                Building people, teams, and meaningful organizational impact.
              </h2>
              <p data-i18n="aboutBody">
                Naila Azahra is a Psychology student at Hasanuddin University
                passionate about Human Resources Development, talent growth, and
                organizational effectiveness. Experienced in recruitment,
                performance monitoring, and team leadership, she combines
                psychology insights with data-driven approaches to support
                people and organizational development.
              </p>
            </div>

            <div className="education-grid">
              <article className="card reveal">
                <span className="edu-logo">
                  <Image src="/logo-unhas.webp" alt="Hasanuddin University logo" width={256} height={256} sizes="72px" {...optimizedImageProps} />
                </span>
                <h3>Hasanuddin University</h3>
                <p data-i18n="eduHasanuddin">
                  Psychology student with a strong interest in Human Resources
                  Development, organizational behavior, talent management, and
                  people development.
                </p>
              </article>
              <article className="card reveal">
                <span className="edu-logo">
                  <Image
                    src="/logo-ions.webp"
                    alt="IONs International Education logo"
                    width={256}
                    height={256}
                    sizes="72px"
                    {...optimizedImageProps}
                  />
                </span>
                <h3>IONs International Education</h3>
                <p data-i18n="eduIons">
                  Strengthened professional English communication, public
                  speaking confidence, and cross-cultural collaboration skills
                  through international learning experiences.
                </p>
              </article>
              <article className="card reveal">
                <span className="edu-logo edu-logo-wide">
                  <Image
                    src="/logo-al-abidin.webp"
                    alt="Al-Abidin Bilingual Boarding School logo"
                    width={512}
                    height={256}
                    sizes="188px"
                    {...optimizedImageProps}
                  />
                </span>
                <h3>Al-Abidin Bilingual Boarding School</h3>
                <p data-i18n="eduAlabidin">
                  Built strong foundations in bilingual communication,
                  discipline, leadership, and academic English through Cambridge
                  international education.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="skillsEyebrow">
                Skills
              </p>
              <h2 data-i18n="skillsTitle">
                A balanced toolkit for talent, analysis, and creative
                communication.
              </h2>
            </div>

            <div className="skills-grid">
              {skillCards.map((card) => (
                <article className="skill-card reveal" key={card.title}>
                  {card.icon ? (
                    <span className="card-icon">{card.icon}</span>
                  ) : null}
                  <h3 data-i18n={card.titleKey}>{card.title}</h3>
                  {card.type === "logos" ? (
                    <div className="skill-tool-grid">
                      {card.items.map((tool) => (
                        <div className="skill-tool" key={tool.name}>
                          <span
                            className={`skill-tool-mark ${imageLogoBrands.has(tool.brand) ? "is-image" : ""}`.trim()}
                            aria-hidden="true"
                          >
                            <SkillLogo brand={tool.brand} />
                          </span>
                          <span className="skill-tool-name">{tool.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : card.type === "languages" ? (
                    <div className="skill-language-list">
                      {card.items.map((language) => (
                        <div
                          className="skill-language-item"
                          key={language.label}
                        >
                          <strong>{language.label}</strong>
                          <span data-i18n={language.detailKey}>{language.detail}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="chip-list">
                      {card.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section timeline-section" id="experience">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="experienceEyebrow">
                Experience
              </p>
              <h2 data-i18n="experienceTitle">
                People operations, youth leadership, and impact programs.
              </h2>
              <p data-i18n="experienceBody">
                Selected roles where Naila has led teams, managed talent
                workflows, and translated ideas into community outcomes.
              </p>
            </div>

            <div className="timeline">
              {activeExperiences.map((experience, index) => (
                <article
                  className="timeline-card reveal"
                  key={experience.id ?? experience.role}
                >
                  <button
                    className="timeline-trigger"
                    type="button"
                    aria-expanded={index === 0 ? "true" : "false"}
                  >
                    <span className="timeline-title">
                      {experience.logo?.src ? (
                        <span className="timeline-logo">
                          <Image
                            src={experience.logo.src}
                            alt={experience.logo.alt || experience.role}
                            width={96}
                            height={96}
                            sizes="48px"
                            {...optimizedImageProps}
                          />
                        </span>
                      ) : null}
                      <span className="timeline-title-text">
                        <strong>{experience.role}</strong>
                        <small>{experience.organization}</small>
                      </span>
                    </span>
                    <span className="click-cue">Open</span>
                  </button>
                  <div className="timeline-content">
                    <div className="metric-row">
                      {(experience.metrics ?? []).map((metric) => (
                        <span key={metric}>{metric}</span>
                      ))}
                    </div>
                    <ul>
                      {(experience.bullets ?? []).map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section editing-section" id="editing">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="editingEyebrow">
                Editing
              </p>
              <h2 data-i18n="editingTitle">Featured Editing Projects</h2>
              <p data-i18n="editingBody">
                A selection of editing projects showcasing my editing expertise
                and creative approach.
              </p>
            </div>

            <div className="editing-layout">
              <div
                className="editing-phone-row reveal"
                data-anim="left"
                aria-label="Featured mobile editing previews"
              >
                {phoneEditingItems.map((item, index) => (
                  <article
                    className="editing-phone-card"
                    style={{ "--phone-enter-delay": `${index * 120}ms` }}
                    key={item.id ?? `${item.title}-${index}`}
                  >
                    <div className="iphone-mockup">
                      <div className="iphone-side-button iphone-side-button-left" aria-hidden="true"></div>
                      <div className="iphone-side-button iphone-side-button-right" aria-hidden="true"></div>
                      <div className="iphone-screen">
                        <span className="iphone-island" aria-hidden="true"></span>
                        <span className="iphone-speaker" aria-hidden="true"></span>
                        <span className="iphone-home-indicator" aria-hidden="true"></span>
                        {item.image?.src ? (
                          <Image
                            src={getCardImageSrc(item.image)}
                            alt={item.image.alt || item.title}
                            fill
                            sizes="(max-width: 640px) 45vw, 220px"
                            {...optimizedImageProps}
                          />
                        ) : null}
                      </div>
                    </div>
                    {item.href ? (
                      <a
                        className="editing-instagram-button"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${item.instagramName || item.title || "Instagram"} on Instagram`}
                      >
                        <InstagramIcon />
                        <span title={item.instagramName || item.title || "Instagram"}>
                          {item.instagramName || item.title || "Instagram"}
                        </span>
                      </a>
                      ) : null}
                  </article>
                ))}
              </div>

              <div
                className="editing-gallery-shell reveal"
                data-anim="right"
                aria-label="Scrollable editing project gallery"
                tabIndex={0}
              >
                <div className="editing-gallery-track">
                  {galleryEditingItems.map((item, index) => {
                    const imageContent = item.image?.src ? (
                      <Image
                        className="editing-gallery-image"
                        src={getCardImageSrc(item.image)}
                        alt={item.image.alt || item.title}
                        fill
                        sizes="(max-width: 640px) 30vw, 18vw"
                        {...optimizedImageProps}
                      />
                    ) : null;

                    return (
                      <figure className="editing-gallery-item" key={item.id ?? `${item.title}-${index}`}>
                        {imageContent ? (
                          <Lightbox
                            src={getCardImageSrc(item.image)}
                            alt={item.image.alt || item.title}
                          >
                            {imageContent}
                          </Lightbox>
                        ) : null}
                      </figure>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="projectsEyebrow">
                Projects
              </p>
              <h2 data-i18n="projectsTitle">
                Projects Driven by People, Purpose, and Social Impact.
              </h2>
              <p data-i18n="projectsBody">
                A showcase of initiatives designed to create meaningful change
                through collaboration, community-centered solutions, and
                measurable impact.
              </p>
            </div>

            <div className="project-grid">
              {activeProjects.map((project) => {
                const summary = getProjectSummaryPreview(project);

                return (
                  <ProjectCard
                    key={project.id ?? project.title}
                    project={project}
                    summary={summary}
                    mediaStyle={getMediaStyle(project.image)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {featuredCommunityProject ? (
          <section className="section community-project-section" id="community-project">
            <div className="container community-project-layout">
              <div className="community-project-media reveal" data-anim="left">
                {featuredCommunityProject.image?.src ? (
                  <Image
                    src={featuredCommunityProject.image.src}
                    alt={
                      featuredCommunityProject.image.alt ||
                      featuredCommunityProject.title
                    }
                    width={1600}
                    height={1388}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) calc(100vw - 48px), 58vw"
                    {...optimizedImageProps}
                  />
                ) : null}
              </div>
              <div className="community-project-copy reveal" data-anim="right">
                <h2
                  data-lang-en={featuredCommunityProject.title}
                  data-lang-id={
                    featuredCommunityProject.titleId ||
                    featuredCommunityProject.title
                  }
                >
                  {featuredCommunityProject.title}
                </h2>
                <p
                  data-lang-en={featuredCommunityProject.description}
                  data-lang-id={
                    featuredCommunityProject.descriptionId ||
                    featuredCommunityProject.description
                  }
                >
                  {featuredCommunityProject.description}
                </p>
                {featuredCommunityProject.href ? (
                  <a
                    className="button button-primary"
                    href={featuredCommunityProject.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowUpRight aria-hidden="true" />
                    <span
                      data-lang-en={featuredCommunityProject.buttonLabel || "Website"}
                      data-lang-id={
                        featuredCommunityProject.buttonLabelId ||
                        featuredCommunityProject.buttonLabel ||
                        "Website"
                      }
                    >
                      {featuredCommunityProject.buttonLabel || "Website"}
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section className="section news-section" id="news">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="newsEyebrow">
                News
              </p>
              <h2 data-i18n="newsTitle">
                Featured News & Media Coverage of leadership, education, and
                community impact.
              </h2>
              <p data-i18n="newsBody">
                Selected articles covering Naila's achievements, Growmates
                initiatives, education programs, and social collaboration
                projects.
              </p>
            </div>

            <NewsCarousel articles={activeNews} />
          </div>
        </section>

        <section className="section" id="achievements">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow" data-i18n="achievementsEyebrow">
                Achievements & Activities
              </p>
              <h2 data-i18n="achievementsTitle">
                Recognition across leadership, research, and communication.
              </h2>
            </div>

            <div className="achievement-grid">
              {activeAchievements.map((achievement) => (
                <a
                  key={achievement.slug}
                  className="award-card achievement-card reveal"
                  href={`/achievements/${achievement.slug}`}
                  aria-label={`View more about ${achievement.title}`}
                >
                  <div className="award-media">
                    {achievement.image ? (
                      <Image
                        className="award-image"
                        src={getCardImageSrc(achievement.image)}
                        alt={achievement.image.alt}
                        style={getMediaStyle(achievement.image)}
                        fill
                        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 50vw, 25vw"
                        {...optimizedImageProps}
                      />
                    ) : null}
                  </div>
                  <div className="award-copy">
                    <span className="award-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M7 3h10v6a5 5 0 0 1-4 4.9V17h4v2H7v-2h4v-3.1A5 5 0 0 1 7 9V3Zm2 2v4a3 3 0 0 0 6 0V5H9ZM5 5v4c0 1.1.9 2 2 2v2a4 4 0 0 1-4-4V5h2Zm14 0h2v4a4 4 0 0 1-4 4v-2c1.1 0 2-.9 2-2V5Z" />
                      </svg>
                    </span>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.summary}</p>
                    <span className="award-readmore">
                      <span data-i18n="achievementReadMore">Read more</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13.5 5.5 20 12l-6.5 6.5-1.4-1.4 4-4H4v-2h12.1l-4-4 1.4-1.6Z" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy reveal">
              <p className="eyebrow" data-i18n="contactEyebrow">
                Contact
              </p>
              <h2 data-i18n="contactTitle">
                Let's build people-centered growth systems.
              </h2>
              <p data-i18n="contactBody">
                Reach out for HR collaboration, youth leadership programs,
                organizational development work, or psychology-informed people
                projects.
              </p>
              <div className="contact-links">
                <a
                  className="social-link social-link-linkedin"
                  href="https://www.linkedin.com/in/naila-azahra-73060a245"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a className="social-link social-link-email" href="mailto:nailaazahra93@gmail.com">
                  <Mail aria-hidden="true" />
                  Email
                </a>
                <a
                  className="social-link social-link-instagram"
                  href="https://www.instagram.com/nailaazahrra"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter backTopHref="#home" />
      <ClientInteractions />
    </>
  );
}
