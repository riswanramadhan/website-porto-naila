import { achievements } from "./achievements";

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
    href: "#contact",
    image: {
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=75",
      alt: "Youth learning and community education program",
    },
    problem: "Young people needed approachable mental health support and credible guidance.",
    solution:
      "Built a structured outreach concept combining education, peer support, and referral awareness.",
    impact:
      "Improved access to supportive conversations and strengthened community mental health literacy.",
    orderIndex: 1,
  },
  {
    id: 2,
    title: "Journey for Self",
    href: "#contact",
    image: {
      src: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?auto=format&fit=crop&w=900&q=75",
      alt: "Reflective journaling and self development workshop",
    },
    problem: "Students often lacked guided space to reflect on identity, resilience, and personal growth.",
    solution:
      "Created a reflective learning experience with psychology-based prompts and facilitation.",
    impact:
      "Helped participants build self-awareness and more intentional personal development habits.",
    orderIndex: 2,
  },
  {
    id: 3,
    title: "Schoolaship",
    href: "#contact",
    image: {
      src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=75",
      alt: "Scholarship preparation and student mentoring",
    },
    problem: "Scholarship information can feel scattered, intimidating, and difficult to act on.",
    solution:
      "Organized practical scholarship guidance into clearer steps, resources, and preparation support.",
    impact:
      "Made education opportunities easier to understand and pursue for student communities.",
    orderIndex: 3,
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

export const portfolio = {
  experiences,
  projects,
  news,
  achievements,
};
