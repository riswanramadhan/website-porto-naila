import { achievements } from "./achievements";

export const heroStats = [
  {
    id: 1,
    value: 100,
    suffix: "+",
    label: "Talent Applications Evaluated Through Structured Recruitment & Selection",
    labelId: "Lamaran Talenta Dievaluasi Melalui Rekrutmen & Seleksi Terstruktur",
    isActive: true,
    orderIndex: 1,
  },
  {
    id: 2,
    value: 23,
    suffix: "+",
    label: "Team Members Led Across Multiple Organizational Projects",
    labelId: "Anggota Tim Dipimpin dalam Berbagai Proyek Organisasi",
    isActive: true,
    orderIndex: 2,
  },
  {
    id: 3,
    value: 200,
    suffix: "+",
    label: "Beneficiaries Impacted Through Community Programs",
    labelId: "Penerima Manfaat Terdampak Melalui Program Komunitas",
    isActive: true,
    orderIndex: 3,
  },
  {
    id: 4,
    value: 78,
    suffix: "%",
    label: "Performance Improvement Achieved Through Training & Development Programs",
    labelId: "Peningkatan Performa Dicapai Melalui Program Pelatihan & Pengembangan",
    isActive: true,
    orderIndex: 4,
  },
];

export const experiences = [
  {
    id: 1,
    role: "Founder & Management Board Leader",
    organization: "Growmates",
    metrics: ["23 members managed", "78% performance growth"],
    bullets: [
      "Designed management systems for program planning, role clarity, and performance monitoring.",
      "Led coordination rhythms that helped volunteers move from ideas into accountable execution.",
    ],
    orderIndex: 1,
  },
  {
    id: 2,
    role: "Talent Management",
    organization: "Kitabisa",
    metrics: ["87+ candidates screened", "Recruitment support"],
    bullets: [
      "Supported candidate screening, shortlisting, and communication across recruitment pipelines.",
      "Helped maintain structured candidate data for clearer follow-up and decision making.",
    ],
    orderIndex: 2,
  },
  {
    id: 3,
    role: "HR Intern",
    organization: "Lembaga Bantuan Hukum Asosiasi Perempuan untuk Keadilan",
    metrics: ["HR administration", "People documentation"],
    bullets: [
      "Assisted HR documentation, administrative workflows, and internal coordination.",
      "Observed people-centered systems in a mission-driven legal aid environment.",
    ],
    orderIndex: 3,
  },
  {
    id: 4,
    role: "Project Officer",
    organization: "Halo Jiwa Indonesia",
    metrics: ["150+ beneficiaries", "Mental health program"],
    bullets: [
      "Coordinated program details across planning, outreach, implementation, and evaluation.",
      "Worked with youth-focused mental health initiatives to make support more accessible.",
    ],
    orderIndex: 4,
  },
  {
    id: 5,
    role: "Social Media Management",
    organization: "Halo Jiwa Indonesia",
    metrics: ["Content planning", "Community awareness"],
    bullets: [
      "Translated mental health themes into clear social content and campaign narratives.",
      "Supported communication consistency through scheduling, copywriting, and visual coordination.",
    ],
    orderIndex: 5,
  },
];

export const projects = [
  {
    id: 1,
    title: "Hope & Help",
    image: {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=75",
      alt: "Youth learning and community education program",
    },
    summary:
      "A structured mental health outreach concept combining education, peer support, referral awareness, and approachable guidance for young people.",
    orderIndex: 1,
  },
  {
    id: 2,
    title: "Journey for Self",
    image: {
      src: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?auto=format&fit=crop&w=900&q=75",
      alt: "Reflective journaling and self development workshop",
    },
    summary:
      "A reflective learning experience using psychology-based prompts and facilitation to help students build self-awareness, resilience, and personal growth habits.",
    orderIndex: 2,
  },
  {
    id: 3,
    title: "Schoolaship",
    image: {
      src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=75",
      alt: "Scholarship preparation and student mentoring",
    },
    summary:
      "A practical scholarship guidance initiative that organizes information, resources, and preparation support into clearer steps for student communities.",
    orderIndex: 3,
  },
];

export const communityProjects = [
  {
    id: 1,
    title: "Featured Community Project",
    titleId: "Proyek Komunitas Pilihan",
    description:
      "Founded and led a community initiative focused on connecting people, sharing knowledge, and fostering meaningful collaboration.",
    descriptionId:
      "Mendirikan dan memimpin inisiatif komunitas yang berfokus menghubungkan orang, berbagi pengetahuan, dan membangun kolaborasi bermakna.",
    buttonLabel: "Website",
    buttonLabelId: "Website",
    href: "https://growmates.dekatlokal.com/",
    image: {
      src: "/laptop-growmates.svg",
      alt: "Growmates website preview on a laptop",
    },
    isActive: true,
    orderIndex: 1,
  },
];

export const news = [
  {
    id: 1,
    source: "Great Edu Indonesia",
    title: "Naila Azahra Raih Berbagai Prestasi Lewat Kepercayaan Diri Berbahasa Inggris",
    summary:
      "A profile story about Naila's confidence in English communication and the achievements she built through learning experiences.",
    href: "https://greatedunesia.id/aktivitas/naila-azahra-raih-berbagai-prestasi-lewat-kepercayaan-diri-berbahasa-inggris/2026/",
    image: {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=75",
      alt: "Professional learning and communication session",
    },
    orderIndex: 1,
  },
  {
    id: 2,
    source: "Identitas Unhas / 5 July 2024",
    title: "Growmates, Bergerak untuk Pendidikan dan Kesetaraan Gender",
    summary:
      "Coverage of Growmates as a community focused on quality education, gender equality, and wider social impact in Makassar.",
    href: "https://identitasunhas.com/growmates-bergerak-untuk-pendidikan-dan-kesetaraan-gender/",
    image: {
      src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=75",
      alt: "Students collaborating in an education program",
    },
    orderIndex: 2,
  },
  {
    id: 3,
    source: "Identitas Unhas / 9 September 2024",
    title: "Komunitas Growmates Galakkan Semangat Belajar Anak-anak di TPA Antang",
    summary:
      "A report on Hope & Help, a Growmates program encouraging children's learning motivation through education and community support.",
    href: "https://identitasunhas.com/komunitas-growmates-galakkan-semangat-belajar-anak-anak-di-tpa-antang/",
    image: {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=75",
      alt: "Children learning in a community classroom",
    },
    orderIndex: 3,
  },
  {
    id: 4,
    source: "Identitas Unhas",
    title: "Gandeng Growmates, Empathic.id Ajak Masyarakat Berbagi Parsel Lebaran Lewat Program ERA",
    summary:
      "Coverage of a Ramadan collaboration inviting public participation in sharing Lebaran parcels through a community-driven program.",
    href: "https://identitasunhas.com/gandeng-growmates-empathic-id-ajak-masyarakat-berbagi-parsel-lebaran-lewat-program-era/",
    image: {
      src: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=75",
      alt: "Community donation and outreach program",
    },
    orderIndex: 4,
  },
];

export const editing = [
  {
    id: 1,
    type: "phone",
    title: "Short-form editing showcase",
    description: "Mobile-first editing sample with clean pacing and visual rhythm.",
    href: "https://www.instagram.com/nailaazahrra",
    instagramName: "@nailaazahrra",
    isActive: true,
    image: {
      src: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=900&q=75",
      alt: "Social media editing project preview on phone",
    },
    orderIndex: 1,
  },
  {
    id: 2,
    type: "phone",
    title: "Campaign edit preview",
    description: "A compact visual edit prepared for social storytelling.",
    href: "https://www.instagram.com/nailaazahrra",
    instagramName: "@nailaazahrra",
    isActive: true,
    image: {
      src: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=900&q=75",
      alt: "Campaign editing project preview on phone",
    },
    orderIndex: 2,
  },
  {
    id: 3,
    type: "gallery",
    title: "Editorial layout",
    description: "A polished editing composition for digital presentation.",
    isActive: true,
    image: {
      src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=75",
      alt: "Editorial editing project composition",
    },
    orderIndex: 3,
  },
  {
    id: 4,
    type: "gallery",
    title: "Social content system",
    description: "A visual set designed for consistent social media storytelling.",
    isActive: true,
    image: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=75",
      alt: "Social media content editing workflow",
    },
    orderIndex: 4,
  },
  {
    id: 5,
    type: "gallery",
    title: "Creative campaign frame",
    description: "A refined campaign visual with balanced typography and imagery.",
    isActive: true,
    image: {
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=75",
      alt: "Creative campaign editing frame",
    },
    orderIndex: 5,
  },
];

export const portfolio = {
  heroStats,
  experiences,
  projects,
  communityProjects,
  editing,
  news,
  achievements,
};
