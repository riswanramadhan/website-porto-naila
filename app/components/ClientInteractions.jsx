"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const translations = {
  en: {
    navAbout: "About",
    navExperience: "Experience",
    navProof: "Proof",
    navProjects: "Projects",
    navNews: "News",
    navSkills: "Skills",
    navAchievements: "Achievements",
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
    projectsTitle: "Projects Driven by People, Purpose, and Social Impact.",
    projectsBody:
      "A showcase of initiatives designed to create meaningful change through collaboration, community-centered solutions, and measurable impact.",
    projectProblem: "Problem",
    projectSolution: "Solution",
    projectImpact: "Impact",
    projectReadMore: "Read more about this project",
    newsEyebrow: "News",
    newsTitle: "Featured News & Media Coverage of leadership, education, and community impact.",
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
    skillsSoftSkills: "Soft Skills",
    skillsAnalytics: "Analytics",
    skillsCreative: "Creative",
    skillsLanguage: "Language",
    skillsHrTools: "HR Tools",
    achievementsEyebrow: "Achievements & Activities",
    achievementsTitle: "Recognition across leadership, research, and communication.",
    achievementEyebrow: "Achievement",
    achievementReadMore: "Read more",
    achievementDocs: "Documentation",
    achievementCertificate: "Certificate",
    backToAchievements: "Back to achievements",
    contactEyebrow: "Contact",
    contactTitle: "Let's build people-centered growth systems.",
    contactBody:
      "Reach out for HR collaboration, youth leadership programs, organizational development work, or psychology-informed people projects.",
    formName: "Name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "you@example.com",
    formMessage: "Message",
    formMessagePlaceholder: "Tell me about your project",
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
    navAchievements: "Pencapaian",
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
    projectsTitle: "Proyek digerakkan oleh manusia, tujuan, dan dampak sosial.",
    projectsBody:
      "Rangkaian inisiatif yang dirancang untuk menciptakan perubahan melalui kolaborasi, solusi berbasis komunitas, dan dampak terukur.",
    projectProblem: "Masalah",
    projectSolution: "Solusi",
    projectImpact: "Dampak",
    projectReadMore: "Baca lebih lanjut tentang proyek ini",
    newsEyebrow: "Berita",
    newsTitle: "Berita dan liputan media tentang kepemimpinan, pendidikan, dan dampak komunitas.",
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
    skillsSoftSkills: "Soft Skills",
    skillsAnalytics: "Analitik",
    skillsCreative: "Kreatif",
    skillsLanguage: "Bahasa",
    skillsHrTools: "Perangkat HR",
    achievementsEyebrow: "Pencapaian & Aktivitas",
    achievementsTitle: "Pengakuan dalam kepemimpinan, riset, dan komunikasi.",
    achievementEyebrow: "Pencapaian",
    achievementReadMore: "Selengkapnya",
    achievementDocs: "Dokumentasi",
    achievementCertificate: "Sertifikat",
    backToAchievements: "Kembali ke pencapaian",
    contactEyebrow: "Kontak",
    contactTitle: "Mari bangun sistem pertumbuhan yang berpusat pada manusia.",
    contactBody:
      "Hubungi untuk kolaborasi HR, program kepemimpinan muda, pengembangan organisasi, atau proyek people berbasis psikologi.",
    formName: "Nama",
    formNamePlaceholder: "Nama Anda",
    formEmail: "Email",
    formEmailPlaceholder: "you@example.com",
    formMessage: "Pesan",
    formMessagePlaceholder: "Ceritakan tentang proyek Anda",
    sendMessage: "Kirim Pesan",
    backTop: "Kembali ke atas",
    open: "Buka",
    close: "Tutup",
    formSuccess: "Terima kasih. Pesanmu siap dikirim jika backend sudah terhubung.",
  },
};

const typingSequences = {
  en: ["Psychology", "HR", "Leadership"],
  id: ["Psikologi", "HR", "Kepemimpinan"],
};

export default function ClientInteractions() {
  const pathname = usePathname();

  useEffect(() => {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
    const timelineTriggers = Array.from(document.querySelectorAll(".timeline-trigger"));
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    const themeToggles = Array.from(document.querySelectorAll(".theme-toggle"));
    const languageToggles = Array.from(document.querySelectorAll(".language-toggle"));
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");
    const ambientItems = Array.from(document.querySelectorAll(".ambient-orb, .magic-line"));
    const typingTarget = document.querySelector("[data-typing='hero'] .typing-text");
    const statCounters = Array.from(document.querySelectorAll("[data-count]"));
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let currentLanguage = localStorage.getItem("language") || "en";
    let currentTheme = localStorage.getItem("theme") || "light";

    const updateThemeLabels = () => {
      themeToggles.forEach((toggle) => {
        const label = toggle.querySelector("[data-i18n='themeLabel']");
        if (!label) return;
        label.textContent =
          currentTheme === "dark"
            ? translations[currentLanguage].themeLight
            : translations[currentLanguage].themeDark;
      });
    };

    const setTheme = (theme) => {
      currentTheme = theme;
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);

      themeToggles.forEach((toggle) => {
        toggle.setAttribute(
          "aria-label",
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
        toggle.setAttribute("aria-checked", String(theme === "dark"));
      });

      updateThemeLabels();
    };

    const updateTimelineCues = () => {
      timelineTriggers.forEach((trigger) => {
        const cue = trigger.querySelector(".click-cue");
        if (!cue) return;
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        cue.textContent = isExpanded
          ? translations[currentLanguage].close
          : translations[currentLanguage].open;
      });
    };

    const syncTimelineHeights = () => {
      timelineTriggers.forEach((trigger) => {
        const content = trigger.nextElementSibling;
        if (!(content instanceof HTMLElement)) return;
        if (trigger.getAttribute("aria-expanded") === "true") {
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          content.style.maxHeight = "0px";
        }
      });
    };

    let typingTimer;
    const getTypingWords = (language) => typingSequences[language] ?? typingSequences.en;
    const stopTyping = () => {
      if (typingTimer) {
        globalThis.clearTimeout(typingTimer);
        typingTimer = null;
      }
    };
    const setTypingStatic = () => {
      if (!typingTarget) return;
      const words = getTypingWords(currentLanguage);
      typingTarget.textContent = words.join(" / ");
    };
    const startTyping = () => {
      if (!typingTarget) return;
      const words = getTypingWords(currentLanguage);
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const step = () => {
        const currentWord = words[wordIndex] ?? "";
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        typingTarget.textContent = currentWord.slice(0, charIndex);

        let delay = isDeleting ? 38 : 70 + Math.random() * 60;
        if (!isDeleting && charIndex >= currentWord.length) {
          delay = 900;
          isDeleting = true;
        } else if (isDeleting && charIndex <= 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 280;
        }

        typingTimer = globalThis.setTimeout(step, delay);
      };

      typingTimer = globalThis.setTimeout(step, 260);
    };
    const initTyping = () => {
      stopTyping();
      if (!typingTarget) return;
      if (prefersReducedMotion) {
        setTypingStatic();
        return;
      }
      startTyping();
    };

    const countAnimations = new Map();
    const formatCount = (value, suffix) => `${value}${suffix}`;
    const animateCount = (element) => {
      if (!element || element.dataset.counted === "true") return;
      const raw = Number(element.dataset.count);
      const target = Number.isFinite(raw) ? raw : 0;
      const suffix = element.dataset.countSuffix || "";
      const duration = Number(element.dataset.countDuration) || 1200;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.round(target * easeOut(progress));
        element.textContent = formatCount(current, suffix);
        if (progress < 1) {
          const frameId = requestAnimationFrame(step);
          countAnimations.set(element, frameId);
        } else {
          element.dataset.counted = "true";
          countAnimations.delete(element);
        }
      };

      element.textContent = formatCount(0, suffix);
      const frameId = requestAnimationFrame(step);
      countAnimations.set(element, frameId);
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

      document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        if (translations[language][key]) {
          element.setAttribute("placeholder", translations[language][key]);
        }
      });

      languageToggles.forEach((toggle) => {
        const nextLanguage = language === "en" ? "Indonesian" : "English";
        toggle.setAttribute("aria-label", `Switch language to ${nextLanguage}`);
        toggle.setAttribute("aria-checked", String(language === "en"));
      });

      updateThemeLabels();
      updateTimelineCues();
      initTyping();
      syncTimelineHeights();
    };

    const closeMobileMenu = () => {
      navToggle?.setAttribute("aria-expanded", "false");
      navMenu?.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    const handleNavToggle = () => {
      if (!navToggle) return;
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu?.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    };

    const handleNavLinkClick = () => {
      closeMobileMenu();
    };

    const handleThemeToggle = () => {
      setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    const handleLanguageToggle = () => {
      setLanguage(currentLanguage === "en" ? "id" : "en");
    };

    const timelineHandlers = new Map();
    const handleTimelineClick = (trigger) => () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      timelineTriggers.forEach((item) => item.setAttribute("aria-expanded", "false"));
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      updateTimelineCues();
      syncTimelineHeights();
    };

    navToggle?.addEventListener("click", handleNavToggle);
    navLinks.forEach((link) => link.addEventListener("click", handleNavLinkClick));
    themeToggles.forEach((toggle) => toggle.addEventListener("click", handleThemeToggle));
    languageToggles.forEach((toggle) => toggle.addEventListener("click", handleLanguageToggle));
    timelineTriggers.forEach((trigger) => {
      const handler = handleTimelineClick(trigger);
      timelineHandlers.set(trigger, handler);
      trigger.addEventListener("click", handler);
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
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href.endsWith(`#${entry.target.id}`));
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    document.querySelectorAll("main section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    statCounters.forEach((element) => {
      if (prefersReducedMotion) {
        const raw = Number(element.dataset.count);
        const target = Number.isFinite(raw) ? raw : 0;
        const suffix = element.dataset.countSuffix || "";
        element.textContent = formatCount(target, suffix);
        element.dataset.counted = "true";
        return;
      }
      countObserver.observe(element);
    });

    const animateAmbient = () => {
      const scrollRatio =
        window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
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
    let cursorFrame;

    const moveCursor = () => {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      if (cursorDot) {
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }
      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      cursorFrame = requestAnimationFrame(moveCursor);
    };

    const handleMouseMove = (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
    };

    const hoverTargets = Array.from(document.querySelectorAll("a, button, input, textarea"));
    const handleHover = () => document.body.classList.add("cursor-active");
    const handleLeave = () => document.body.classList.remove("cursor-active");

    hoverTargets.forEach((element) => {
      element.addEventListener("mouseenter", handleHover);
      element.addEventListener("mouseleave", handleLeave);
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", animateAmbient, { passive: true });
    window.addEventListener("resize", syncTimelineHeights);

    setTheme(currentTheme);
    setLanguage(currentLanguage);
    updateTimelineCues();
    syncTimelineHeights();
    animateAmbient();
    moveCursor();

    return () => {
      navToggle?.removeEventListener("click", handleNavToggle);
      navLinks.forEach((link) => link.removeEventListener("click", handleNavLinkClick));
      themeToggles.forEach((toggle) => toggle.removeEventListener("click", handleThemeToggle));
      languageToggles.forEach((toggle) => toggle.removeEventListener("click", handleLanguageToggle));
      timelineHandlers.forEach((handler, trigger) => {
        trigger.removeEventListener("click", handler);
      });
      revealObserver.disconnect();
      sectionObserver.disconnect();
      countObserver.disconnect();
      countAnimations.forEach((frameId) => cancelAnimationFrame(frameId));
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", animateAmbient);
      window.removeEventListener("resize", syncTimelineHeights);
      hoverTargets.forEach((element) => {
        element.removeEventListener("mouseenter", handleHover);
        element.removeEventListener("mouseleave", handleLeave);
      });
      if (cursorFrame) {
        cancelAnimationFrame(cursorFrame);
      }
      stopTyping();
    };
  }, [pathname]);

  return null;
}
