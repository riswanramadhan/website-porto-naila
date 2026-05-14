const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const timelineTriggers = document.querySelectorAll(".timeline-trigger");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const themeToggles = document.querySelectorAll(".theme-toggle");
const languageToggles = document.querySelectorAll(".language-toggle");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const ambientItems = document.querySelectorAll(".ambient-orb, .magic-line");

const translations = {
  en: {
    navAbout: "About",
    navExperience: "Experience",
    navProof: "Proof",
    navProjects: "Projects",
    navSkills: "Skills",
    navContact: "Contact",
    navCta: "Let's Talk",
    themeLabel: "Night",
    themeDark: "Night",
    themeLight: "Light",
    languageLabel: "Indonesia",
    heroEyebrow: "Psychology / HR / Leadership",
    heroTitle: "Helping people grow through psychology, leadership, and talent development.",
    heroLead:
      "Psychology student with hands-on experience in recruitment, organizational development, and youth leadership initiatives.",
    viewResume: "View Resume",
    contactMe: "Contact Me",
    statCandidates: "Candidates Screened",
    statTeam: "Team Members Managed",
    statImpact: "Beneficiaries Impacted",
    statGrowth: "Performance Growth",
    aboutEyebrow: "About",
    aboutTitle: "Psychology as a practical lens for healthier organizations.",
    aboutBody:
      "Naila Azahra is a Psychology student at Hasanuddin University with a passion for HR development, recruitment, organizational growth, and leadership. Her work connects human behavior, team systems, and measurable people outcomes.",
    experienceEyebrow: "Experience",
    experienceTitle: "People operations, youth leadership, and impact programs.",
    experienceBody:
      "Selected roles where Naila has led teams, managed talent workflows, and translated ideas into community outcomes.",
    proofEyebrow: "Experience Proof",
    proofTitle: "A visual archive for recruiters to scan real project context.",
    proofBody:
      "Dummy images are used for now, ready to be replaced with event photos, certificates, dashboard screenshots, or program documentation.",
    projectsEyebrow: "Projects",
    projectsTitle: "Case studies with a people-first operating model.",
    projectsBody:
      "Programs shaped around clear problems, practical solutions, and impact that can be communicated simply.",
    skillsEyebrow: "Skills",
    skillsTitle: "A balanced toolkit for talent, analysis, and creative communication.",
    achievementsEyebrow: "Achievements",
    achievementsTitle: "Recognition across leadership, research, and communication.",
    contactEyebrow: "Contact",
    contactTitle: "Let's build people-centered growth systems.",
    contactBody:
      "Reach out for HR collaboration, youth leadership programs, organizational development work, or psychology-informed people projects.",
    formName: "Name",
    formMessage: "Message",
    sendMessage: "Send Message",
    backTop: "Back to top",
    open: "Open",
    close: "Close",
    formSuccess: "Thank you. Your message is ready to be sent from a connected backend.",
  },
  id: {
    navAbout: "Tentang",
    navExperience: "Pengalaman",
    navProof: "Bukti",
    navProjects: "Proyek",
    navSkills: "Keahlian",
    navContact: "Kontak",
    navCta: "Hubungi",
    themeLabel: "Malam",
    themeDark: "Malam",
    themeLight: "Terang",
    languageLabel: "English",
    heroEyebrow: "Psikologi / HR / Kepemimpinan",
    heroTitle: "Membantu manusia bertumbuh melalui psikologi, kepemimpinan, dan pengembangan talenta.",
    heroLead:
      "Mahasiswa psikologi dengan pengalaman langsung dalam rekrutmen, pengembangan organisasi, dan inisiatif kepemimpinan muda.",
    viewResume: "Lihat Resume",
    contactMe: "Hubungi Saya",
    statCandidates: "Kandidat Disaring",
    statTeam: "Anggota Tim Dikelola",
    statImpact: "Penerima Manfaat",
    statGrowth: "Pertumbuhan Performa",
    aboutEyebrow: "Tentang",
    aboutTitle: "Psikologi sebagai lensa praktis untuk organisasi yang lebih sehat.",
    aboutBody:
      "Naila Azahra adalah mahasiswa Psikologi Universitas Hasanuddin dengan minat pada pengembangan HR, rekrutmen, pertumbuhan organisasi, dan kepemimpinan. Karyanya menghubungkan perilaku manusia, sistem tim, dan hasil people yang terukur.",
    experienceEyebrow: "Pengalaman",
    experienceTitle: "People operations, kepemimpinan muda, dan program berdampak.",
    experienceBody:
      "Peran terpilih saat Naila memimpin tim, mengelola alur talenta, dan menerjemahkan ide menjadi dampak komunitas.",
    proofEyebrow: "Bukti Pengalaman",
    proofTitle: "Arsip visual agar HRD dapat melihat konteks proyek dengan cepat.",
    proofBody:
      "Saat ini memakai dummy image dan siap diganti dengan foto kegiatan, sertifikat, screenshot dashboard, atau dokumentasi program.",
    projectsEyebrow: "Proyek",
    projectsTitle: "Studi kasus dengan model kerja yang people-first.",
    projectsBody:
      "Program yang dibentuk dari masalah jelas, solusi praktis, dan dampak yang mudah dipahami.",
    skillsEyebrow: "Keahlian",
    skillsTitle: "Toolkit seimbang untuk talenta, analisis, dan komunikasi kreatif.",
    achievementsEyebrow: "Pencapaian",
    achievementsTitle: "Pengakuan dalam kepemimpinan, riset, dan komunikasi.",
    contactEyebrow: "Kontak",
    contactTitle: "Mari bangun sistem pertumbuhan yang berpusat pada manusia.",
    contactBody:
      "Hubungi untuk kolaborasi HR, program kepemimpinan muda, pengembangan organisasi, atau proyek people berbasis psikologi.",
    formName: "Nama",
    formMessage: "Pesan",
    sendMessage: "Kirim Pesan",
    backTop: "Kembali ke atas",
    open: "Buka",
    close: "Tutup",
    formSuccess: "Terima kasih. Pesanmu siap dikirim jika backend sudah terhubung.",
  },
};

let currentLanguage = localStorage.getItem("language") || "en";
let currentTheme = localStorage.getItem("theme") || "light";

const setTheme = (theme) => {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });

  updateThemeLabels();
};

const updateThemeLabels = () => {
  themeToggles.forEach((toggle) => {
    const label = toggle.querySelector("[data-i18n='themeLabel']");
    if (!label) return;
    label.textContent =
      currentTheme === "dark" ? translations[currentLanguage].themeLight : translations[currentLanguage].themeDark;
  });
};

const setLanguage = (language) => {
  currentLanguage = language;
  document.documentElement.lang = language === "id" ? "id" : "en";
  localStorage.setItem("language", language);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  languageToggles.forEach((toggle) => {
    const mono = toggle.querySelector(".mono");
    if (mono) mono.textContent = language === "id" ? "EN" : "ID";
  });

  updateThemeLabels();
  updateTimelineCues();
};

const updateTimelineCues = () => {
  timelineTriggers.forEach((trigger) => {
    const cue = trigger.querySelector(".click-cue");
    if (!cue) return;
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    cue.textContent = isExpanded ? translations[currentLanguage].close : translations[currentLanguage].open;
  });
};

const closeMobileMenu = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navMenu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
});

languageToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "id" : "en");
  });
});

timelineTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    timelineTriggers.forEach((item) => item.setAttribute("aria-expanded", "false"));
    trigger.setAttribute("aria-expanded", String(!isExpanded));
    updateTimelineCues();
  });
});

revealItems.forEach((item, index) => {
  const variant = ["up", "left", "right", "zoom"][index % 4];
  item.dataset.anim = variant;
  item.style.setProperty("--reveal-delay", `${Math.min((index % 5) * 80, 320)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const animateAmbient = () => {
  const scrollRatio = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
  ambientItems.forEach((item, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const y = scrollRatio * 180 * direction;
    const x = Math.sin(scrollRatio * Math.PI * 2 + index) * 34;
    item.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${direction * scrollRatio * 18}deg)`;
  });
};

let cursorX = 0;
let cursorY = 0;
let ringX = 0;
let ringY = 0;

const moveCursor = () => {
  ringX += (cursorX - ringX) * 0.18;
  ringY += (cursorY - ringY) * 0.18;
  if (cursorDot) cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  if (cursorRing) cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(moveCursor);
};

window.addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
});

document.querySelectorAll("a, button, input, textarea").forEach((element) => {
  element.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
  element.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
});

window.addEventListener("scroll", animateAmbient, { passive: true });

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  formNote.textContent = translations[currentLanguage].formSuccess;
});

setTheme(currentTheme);
setLanguage(currentLanguage);
updateTimelineCues();
animateAmbient();
moveCursor();
