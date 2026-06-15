"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const translations = {
  en: {
    navAbout: "About",
    navExperience: "Experience",
    navProof: "Proof",
    navProjects: "Projects",
    navEditing: "Editing",
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
    projectReadMore: "See more",
    projectReadLess: "Back",
    projectDescription: "Description",
    editingEyebrow: "Editing",
    editingTitle: "Featured Editing Projects",
    editingBody:
      "A selection of editing projects showcasing my editing expertise and creative approach.",
    newsEyebrow: "News",
    newsTitle: "Featured News & Media Coverage of leadership, education, and community impact.",
    newsBody:
      "Selected articles covering Naila's achievements, Growmates initiatives, education programs, and social collaboration projects.",
    newsVisit: "Visit",
    newsPhoto: "News Photo",
    newsOne:
      "A profile story about Naila's confidence in English communication and the achievements she built through learning experiences.",
    newsTwo:
      "Coverage of Growmates as a community focused on quality education, gender equality, and wider social impact in Makassar.",
    newsThree:
      "A report on Hope & Help, a Growmates program encouraging children's learning motivation through education and community support.",
    newsFour:
      "Coverage of a Ramadan collaboration inviting public participation in sharing Lebaran parcels through a community-driven program.",
    skillsEyebrow: "Skills",
    skillsTitle: "A balanced toolkit for talent, analysis, and creative communication.",
    skillsSoftSkills: "Soft Skills",
    skillsAnalytics: "Analytics",
    skillsCreative: "Creative",
    skillsLanguage: "Language",
    skillsBahasaNative: "Native",
    skillsEnglishProfessional: "Professional Working Proficiency",
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
    navEditing: "Editing",
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
    projectReadMore: "Selengkapnya",
    projectReadLess: "Kembali",
    projectDescription: "Deskripsi",
    editingEyebrow: "Penyuntingan",
    editingTitle: "Proyek Penyuntingan Pilihan",
    editingBody:
      "Pilihan proyek penyuntingan yang menampilkan keahlian editing dan pendekatan kreatif saya.",
    newsEyebrow: "Berita",
    newsTitle: "Berita dan liputan media tentang kepemimpinan, pendidikan, dan dampak komunitas.",
    newsBody:
      "Artikel pilihan yang meliput prestasi Naila, inisiatif Growmates, program pendidikan, dan proyek kolaborasi sosial.",
    newsVisit: "Kunjungi",
    newsPhoto: "Foto Berita",
    newsOne:
      "Profil tentang kepercayaan diri Naila dalam komunikasi bahasa Inggris dan berbagai prestasi yang dibangun melalui pengalaman belajar.",
    newsTwo:
      "Liputan tentang Growmates sebagai komunitas yang berfokus pada pendidikan berkualitas, kesetaraan gender, dan dampak sosial di Makassar.",
    newsThree:
      "Laporan tentang Hope & Help, program Growmates yang mendorong minat belajar anak melalui edukasi dan dukungan komunitas.",
    newsFour:
      "Liputan kolaborasi Ramadan yang mengajak masyarakat berbagi parsel Lebaran melalui program berbasis komunitas.",
    skillsEyebrow: "Keahlian",
    skillsTitle: "Toolkit seimbang untuk talenta, analisis, dan komunikasi kreatif.",
    skillsSoftSkills: "Soft Skills",
    skillsAnalytics: "Analitik",
    skillsCreative: "Kreatif",
    skillsLanguage: "Bahasa",
    skillsBahasaNative: "Bahasa ibu",
    skillsEnglishProfessional: "Kemampuan kerja profesional",
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
    const hashLinks = Array.from(document.querySelectorAll("a[href^='#'], a[href^='/#']"));
    const timelineTriggers = Array.from(document.querySelectorAll(".timeline-trigger"));
    const projectToggles = Array.from(document.querySelectorAll(".project-flip-toggle"));
    const newsGrid = document.querySelector(".news-grid");
    const newsDots = Array.from(document.querySelectorAll("[data-news-dot]"));
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    const themeToggles = Array.from(document.querySelectorAll(".theme-toggle"));
    const languageToggles = Array.from(document.querySelectorAll(".language-toggle"));
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
        if (!(content instanceof globalThis.HTMLElement)) return;
        if (trigger.getAttribute("aria-expanded") === "true") {
          content.style.maxHeight = "none";
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
      const start = globalThis.performance.now();
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

      document.querySelectorAll("[data-lang-en][data-lang-id]").forEach((element) => {
        const text = language === "id" ? element.dataset.langId : element.dataset.langEn;
        if (text) {
          element.textContent = text;
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

    let menuCloseTimer;
    const closeMobileMenu = () => {
      if (!navToggle || !navMenu) return;
      if (menuCloseTimer) {
        globalThis.clearTimeout(menuCloseTimer);
        menuCloseTimer = null;
      }
      navToggle.setAttribute("aria-expanded", "false");
      if (!navMenu.classList.contains("is-open")) {
        document.body.classList.remove("menu-open");
        return;
      }
      navToggle?.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      navMenu.classList.add("is-closing");
      menuCloseTimer = globalThis.setTimeout(() => {
        navMenu.classList.remove("is-closing");
        document.body.classList.remove("menu-open");
        menuCloseTimer = null;
      }, prefersReducedMotion ? 0 : 280);
    };

    const handleNavToggle = () => {
      if (!navToggle || !navMenu) return;
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMobileMenu();
        return;
      }
      if (menuCloseTimer) {
        globalThis.clearTimeout(menuCloseTimer);
        menuCloseTimer = null;
      }
      navMenu.classList.remove("is-closing");
      navToggle.setAttribute("aria-expanded", "true");
      navMenu.classList.add("is-open");
      document.body.classList.add("menu-open");
    };

    const getHashFromHref = (href) => {
      if (!href) return "";
      if (href.startsWith("#")) return href.slice(1);
      if (href.startsWith("/#")) return href.slice(2);
      return "";
    };

    const scrollToSectionWithoutHash = (href) => {
      const targetId = getHashFromHref(href);
      if (!targetId) return false;
      if (href.startsWith("/#") && window.location.pathname !== "/") return false;

      const target = document.getElementById(targetId);
      if (!target) return false;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      return true;
    };

    const handleHashLinkClick = (event) => {
      const href = event.currentTarget.getAttribute("href") || "";
      if (scrollToSectionWithoutHash(href)) {
        event.preventDefault();
      }
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

    const projectToggleHandlers = new Map();
    const handleProjectToggle = (button) => () => {
      const card = button.closest(".case-card");
      if (!card) return;
      const isExpanded = card.classList.contains("is-flipped");
      const nextExpanded = !isExpanded;
      card.classList.toggle("is-flipped", nextExpanded);
      card.querySelectorAll(".project-flip-toggle").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", String(nextExpanded));
      });
      const front = card.querySelector(".case-card-front");
      const back = card.querySelector(".case-card-back");
      front?.setAttribute("aria-hidden", String(nextExpanded));
      back?.setAttribute("aria-hidden", String(!nextExpanded));
    };

    const updateNewsDots = () => {
      if (!newsGrid || !newsDots.length) return;
      const cards = Array.from(newsGrid.querySelectorAll(".news-card"));
      if (!cards.length) return;
      const gridRect = newsGrid.getBoundingClientRect();
      const activeIndex = cards.reduce(
        (closest, card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left - gridRect.left);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      ).index;
      newsDots.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
    };

    const handleNewsDotClick = (dot) => () => {
      if (!newsGrid) return;
      const index = Number(dot.dataset.newsDot);
      const cards = Array.from(newsGrid.querySelectorAll(".news-card"));
      const target = cards[index];
      target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", inline: "start", block: "nearest" });
    };

    const newsDotHandlers = new Map();

    navToggle?.addEventListener("click", handleNavToggle);
    hashLinks.forEach((link) => link.addEventListener("click", handleHashLinkClick));
    themeToggles.forEach((toggle) => toggle.addEventListener("click", handleThemeToggle));
    languageToggles.forEach((toggle) => toggle.addEventListener("click", handleLanguageToggle));
    timelineTriggers.forEach((trigger) => {
      const handler = handleTimelineClick(trigger);
      timelineHandlers.set(trigger, handler);
      trigger.addEventListener("click", handler);
    });
    projectToggles.forEach((button) => {
      const handler = handleProjectToggle(button);
      projectToggleHandlers.set(button, handler);
      button.addEventListener("click", handler);
    });
    newsDots.forEach((dot) => {
      const handler = handleNewsDotClick(dot);
      newsDotHandlers.set(dot, handler);
      dot.addEventListener("click", handler);
    });
    newsGrid?.addEventListener("scroll", updateNewsDots, { passive: true });

    revealItems.forEach((item, index) => {
      const variant = item.dataset.anim || ["up", "left", "right", "zoom"][index % 4];
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

    window.addEventListener("scroll", animateAmbient, { passive: true });
    window.addEventListener("resize", syncTimelineHeights);

    setTheme(currentTheme);
    setLanguage(currentLanguage);
    updateTimelineCues();
    syncTimelineHeights();
    updateNewsDots();
    animateAmbient();
    if (window.location.pathname === "/" && window.location.hash) {
      const initialHash = window.location.hash;
      window.requestAnimationFrame(() => {
        scrollToSectionWithoutHash(initialHash);
      });
    }

    return () => {
      navToggle?.removeEventListener("click", handleNavToggle);
      hashLinks.forEach((link) => link.removeEventListener("click", handleHashLinkClick));
      themeToggles.forEach((toggle) => toggle.removeEventListener("click", handleThemeToggle));
      languageToggles.forEach((toggle) => toggle.removeEventListener("click", handleLanguageToggle));
      timelineHandlers.forEach((handler, trigger) => {
        trigger.removeEventListener("click", handler);
      });
      projectToggleHandlers.forEach((handler, button) => {
        button.removeEventListener("click", handler);
      });
      newsDotHandlers.forEach((handler, dot) => {
        dot.removeEventListener("click", handler);
      });
      newsGrid?.removeEventListener("scroll", updateNewsDots);
      revealObserver.disconnect();
      sectionObserver.disconnect();
      countObserver.disconnect();
      countAnimations.forEach((frameId) => cancelAnimationFrame(frameId));
      window.removeEventListener("scroll", animateAmbient);
      window.removeEventListener("resize", syncTimelineHeights);
      if (menuCloseTimer) globalThis.clearTimeout(menuCloseTimer);
      stopTyping();
    };
  }, [pathname]);

  return null;
}
