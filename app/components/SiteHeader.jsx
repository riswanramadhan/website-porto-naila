import Link from "next/link";
import { fetchSiteProfile } from "@/lib/portfolio";

export default async function SiteHeader() {
  const profile = await fetchSiteProfile();
  const profileImage = profile.image?.src;

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary navigation">
        <Link className="brand" href="#home" aria-label="Naila Azahra home">
          <span
            className={`brand-mark ${profileImage ? "has-image" : ""}`.trim()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={profile.image.alt || "Naila Azahra profile"}
              />
            ) : (
              "NA"
            )}
          </span>
          <span>Naila Azahra</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="nav-menu"
        >
          <span className="sr-only">Open menu</span>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-menu" id="nav-menu">
          <Link href="#about" data-i18n="navAbout">
            About
          </Link>
          <Link href="#skills" data-i18n="navSkills">
            Skills
          </Link>
          <Link href="#experience" data-i18n="navExperience">
            Experience
          </Link>
          <Link href="#editing" data-i18n="navEditing">
            Editing
          </Link>
          <Link href="#projects" data-i18n="navProjects">
            Projects
          </Link>
          <Link href="#news" data-i18n="navNews">
            News
          </Link>
          <Link href="#achievements" data-i18n="navAchievements">
            Achievements
          </Link>
          <Link href="#contact" data-i18n="navContact">
            Contact
          </Link>
          <div className="nav-mobile-controls">
            <button
              className="control-button toggle-switch theme-toggle"
              type="button"
              role="switch"
              aria-checked="false"
              aria-label="Switch to dark mode"
            >
              <span className="sr-only" data-i18n="themeLabel">
                Night
              </span>
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-icon toggle-icon-sun">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12h2.5M19 12h2.5M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
                  </svg>
                </span>
                <span className="toggle-icon toggle-icon-moon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3a9 9 0 1 0 9 9c0-.45-.04-.89-.1-1.32A6.5 6.5 0 0 1 12.32 3.1C12.21 3.04 12.1 3 12 3Zm-1.08 2.36A8.5 8.5 0 0 0 18.64 13.08 7 7 0 1 1 10.92 5.36Z" />
                  </svg>
                </span>
                <span className="toggle-thumb"></span>
              </span>
            </button>
            <button
              className="control-button toggle-switch language-toggle"
              type="button"
              role="switch"
              aria-checked="false"
              aria-label="Switch language"
            >
              <span className="sr-only" data-i18n="languageLabel">
                Indonesia
              </span>
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-flag toggle-flag-id" aria-hidden="true">
                  <svg viewBox="0 0 18 12" aria-hidden="true">
                    <rect width="18" height="6" fill="#e11d48" />
                    <rect y="6" width="18" height="6" fill="#ffffff" />
                  </svg>
                </span>
                <span className="toggle-flag toggle-flag-uk" aria-hidden="true">
                  <svg viewBox="0 0 18 12" aria-hidden="true">
                    <rect width="18" height="12" fill="#0a3d91" />
                    <path
                      d="M0 0l7 4.5V0h4v4.5L18 0v2L12 6l6 4v2l-7-4.5V12H7V7.5L0 12V10l6-4-6-4V0z"
                      fill="#ffffff"
                    />
                    <path
                      d="M0 0l8 5V0h2v5l8-5v1.4L11 6l7 4.6V12l-8-5v5H8V7L0 12v-1.4L7 6 0 1.4V0z"
                      fill="#d22c32"
                    />
                    <rect x="7" width="4" height="12" fill="#ffffff" />
                    <rect y="4" width="18" height="4" fill="#ffffff" />
                    <rect x="7.7" width="2.6" height="12" fill="#d22c32" />
                    <rect y="4.7" width="18" height="2.6" fill="#d22c32" />
                  </svg>
                </span>
                <span className="toggle-thumb"></span>
              </span>
            </button>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="control-button toggle-switch theme-toggle"
            type="button"
            role="switch"
            aria-checked="false"
            aria-label="Switch to dark mode"
          >
            <span className="sr-only" data-i18n="themeLabel">
              Night
            </span>
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-icon toggle-icon-sun">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12h2.5M19 12h2.5M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
                </svg>
              </span>
              <span className="toggle-icon toggle-icon-moon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.45-.04-.89-.1-1.32A6.5 6.5 0 0 1 12.32 3.1C12.21 3.04 12.1 3 12 3Zm-1.08 2.36A8.5 8.5 0 0 0 18.64 13.08 7 7 0 1 1 10.92 5.36Z" />
                </svg>
              </span>
              <span className="toggle-thumb"></span>
            </span>
          </button>
          <button
            className="control-button toggle-switch language-toggle"
            type="button"
            role="switch"
            aria-checked="false"
            aria-label="Switch language"
          >
            <span className="sr-only" data-i18n="languageLabel">
              Indonesia
            </span>
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-flag toggle-flag-id" aria-hidden="true">
                <svg viewBox="0 0 18 12" aria-hidden="true">
                  <rect width="18" height="6" fill="#e11d48" />
                  <rect y="6" width="18" height="6" fill="#ffffff" />
                </svg>
              </span>
              <span className="toggle-flag toggle-flag-uk" aria-hidden="true">
                <svg viewBox="0 0 18 12" aria-hidden="true">
                  <rect width="18" height="12" fill="#0a3d91" />
                  <path
                    d="M0 0l7 4.5V0h4v4.5L18 0v2L12 6l6 4v2l-7-4.5V12H7V7.5L0 12V10l6-4-6-4V0z"
                    fill="#ffffff"
                  />
                  <path
                    d="M0 0l8 5V0h2v5l8-5v1.4L11 6l7 4.6V12l-8-5v5H8V7L0 12v-1.4L7 6 0 1.4V0z"
                    fill="#d22c32"
                  />
                  <rect x="7" width="4" height="12" fill="#ffffff" />
                  <rect y="4" width="18" height="4" fill="#ffffff" />
                  <rect x="7.7" width="2.6" height="12" fill="#d22c32" />
                  <rect y="4.7" width="18" height="2.6" fill="#d22c32" />
                </svg>
              </span>
              <span className="toggle-thumb"></span>
            </span>
          </button>
          <Link className="nav-cta" href="#contact" data-i18n="navCta">
            Let's Talk
          </Link>
        </div>
      </nav>
    </header>
  );
}
