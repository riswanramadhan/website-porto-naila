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
    navNews: "News",
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
      "Aspiring HR professional with experience in recruitment, talent management, and project leadership.",
    viewResume: "View Resume",
    contactMe: "Contact Me",
    statCandidates: "Talent Applications Evaluated Through Structured Recruitment & Selection",
    statTeam: "Team Members Led Across Multiple Organizational Projects",
    statImpact: "Beneficiaries Impacted Through Community Programs",
    statGrowth: "Performance Improvement Achieved Through Training & Development Programs",
    aboutEyebrow: "About",
    aboutTitle: "Building people, teams, and meaningful organizational impact.",
    aboutBody:
      "Naila Azahra is a Psychology student at Hasanuddin University passionate about Human Resources Development, talent growth, and organizational effectiveness. Experienced in recruitment, performance monitoring, and team leadership, she combines psychology insights with data-driven approaches to support people and organizational development.",
    eduHasanuddin:
      "Psychology student with a strong interest in Human Resources Development, organizational behavior, talent management, and people development.",
    eduIons:
      "Strengthened professional English communication, public speaking confidence, and cross-cultural collaboration skills through international learning experiences.",
    eduAlabidin:
      "Built strong foundations in bilingual communication, discipline, leadership, and academic English through Cambridge international education.",
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
    newsEyebrow: "News",
    newsTitle: "Media coverage of leadership, education, and community impact.",
    newsBody:
      "Selected articles covering Naila's achievements, Growmates initiatives, education programs, and social collaboration projects.",
    newsPhoto: "News Photo",
    newsOne:
      "A profile story about Naila's confidence in English communication and the achievements she built through learning experiences.",
    newsTwo:
      "Coverage of Growmates as a community focused on quality education, gender equality, and wider social impact in Makassar.",
    newsThree:
      "A report on Hope & Help, a Growmates program encouraging children's learning motivation through education and community support.",
    newsFour:
      "Coverage of a Ramadan collaboration inviting public participation in sharing Lebaran parcels through a community-driven program.",
    readArticle: "Read article",
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
    navNews: "Berita",
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
      "Calon profesional HR dengan pengalaman dalam rekrutmen, manajemen talenta, dan kepemimpinan proyek.",
    viewResume: "Lihat Resume",
    contactMe: "Hubungi Saya",
    statCandidates: "Lamaran Talenta Dievaluasi Melalui Rekrutmen & Seleksi Terstruktur",
    statTeam: "Anggota Tim Dipimpin dalam Berbagai Proyek Organisasi",
    statImpact: "Penerima Manfaat Terdampak Melalui Program Komunitas",
    statGrowth: "Peningkatan Performa Dicapai Melalui Program Pelatihan & Pengembangan",
    aboutEyebrow: "Tentang",
    aboutTitle: "Membangun manusia, tim, dan dampak organisasi yang bermakna.",
    aboutBody:
      "Naila Azahra adalah mahasiswa Psikologi Universitas Hasanuddin yang memiliki ketertarikan pada Human Resources Development, pertumbuhan talenta, dan efektivitas organisasi. Berpengalaman dalam rekrutmen, pemantauan performa, dan kepemimpinan tim, ia memadukan wawasan psikologi dengan pendekatan berbasis data untuk mendukung pengembangan manusia dan organisasi.",
    eduHasanuddin:
      "Mahasiswa Psikologi dengan minat kuat pada Human Resources Development, perilaku organisasi, manajemen talenta, dan pengembangan manusia.",
    eduIons:
      "Menguatkan komunikasi bahasa Inggris profesional, kepercayaan diri berbicara di depan publik, dan kolaborasi lintas budaya melalui pengalaman belajar internasional.",
    eduAlabidin:
      "Membangun fondasi kuat dalam komunikasi bilingual, disiplin, kepemimpinan, dan bahasa Inggris akademik melalui pendidikan internasional Cambridge.",
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
    newsEyebrow: "Berita",
    newsTitle: "Liputan media tentang kepemimpinan, pendidikan, dan dampak komunitas.",
    newsBody:
      "Artikel pilihan yang meliput prestasi Naila, inisiatif Growmates, program pendidikan, dan proyek kolaborasi sosial.",
    newsPhoto: "Foto Berita",
    newsOne:
      "Profil tentang kepercayaan diri Naila dalam komunikasi bahasa Inggris dan berbagai prestasi yang dibangun melalui pengalaman belajar.",
    newsTwo:
      "Liputan tentang Growmates sebagai komunitas yang berfokus pada pendidikan berkualitas, kesetaraan gender, dan dampak sosial di Makassar.",
    newsThree:
      "Laporan tentang Hope & Help, program Growmates yang mendorong minat belajar anak melalui edukasi dan dukungan komunitas.",
    newsFour:
      "Liputan kolaborasi Ramadan yang mengajak masyarakat berbagi parsel Lebaran melalui program berbasis komunitas.",
    readArticle: "Baca artikel",
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
    toggle.setAttribute("aria-checked", String(theme === "dark"));
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
  document.documentElement.dataset.language = language;
  localStorage.setItem("language", language);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  languageToggles.forEach((toggle) => {
    const nextLanguage = language === "en" ? "Indonesian" : "English";
    toggle.setAttribute("aria-label", `Switch language to ${nextLanguage}`);
    toggle.setAttribute("aria-checked", String(language === "en"));
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
