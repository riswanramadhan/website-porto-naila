import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { portfolio as staticPortfolio } from "@/data/portfolio";

export const PORTFOLIO_CACHE_TAG = "portfolio-content";
export const PROFILE_CACHE_TAG = "site-profile";

const sortByOrder = (items) =>
  Array.isArray(items)
    ? [...items].sort((a, b) => (a?.orderIndex ?? 999) - (b?.orderIndex ?? 999))
    : [];

const compactText = (items) =>
  items
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .join(" ");

const getProjectSummary = (project = {}) =>
  String(project.summary ?? "").trim() ||
  compactText([project.problem, project.solution, project.impact]);

const normalizeProjects = (items) =>
  sortByOrder(items).map((project) => {
    const { problem, solution, impact, ...rest } = project ?? {};
    return {
      ...rest,
      summary: getProjectSummary(project),
    };
  });

const getSupabaseUrl = () => process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const getSupabasePublishableKey = () =>
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getSupabaseStorageBucket = () =>
  process.env.SUPABASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  "portfolio-assets";

export const getProfileStorageBucket = () =>
  process.env.SUPABASE_PROFILE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET ||
  "profile-assets";

export const getSupabaseKeyMode = () => {
  if (getSupabaseServiceKey()) return "service";
  if (getSupabasePublishableKey()) return "publishable";
  return "missing";
};

export const getSupabaseAdminClient = () => {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();
  const publishableKey = getSupabasePublishableKey();
  const key = serviceKey || publishableKey;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
};

export const isSupabaseConfigured = () => {
  return Boolean(getSupabaseUrl() && (getSupabaseServiceKey() || getSupabasePublishableKey()));
};

export const normalizePortfolio = (payload = {}) => ({
  heroStats: sortByOrder(payload.heroStats ?? staticPortfolio.heroStats),
  experiences: sortByOrder(payload.experiences ?? staticPortfolio.experiences),
  projects: normalizeProjects(payload.projects ?? staticPortfolio.projects),
  communityProjects: sortByOrder(payload.communityProjects ?? staticPortfolio.communityProjects),
  editing: sortByOrder(payload.editing ?? staticPortfolio.editing),
  news: sortByOrder(payload.news ?? staticPortfolio.news),
  achievements: sortByOrder(payload.achievements ?? staticPortfolio.achievements),
});

const fetchPortfolioUncached = async () => {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return normalizePortfolio(staticPortfolio);

  const { data, error } = await supabase
    .from("portfolio_content")
    .select("section_key, content")
    .in("section_key", [
      "heroStats",
      "experiences",
      "projects",
      "communityProjects",
      "editing",
      "news",
      "achievements",
    ]);

  if (error || !data?.length) return normalizePortfolio(staticPortfolio);

  const payload = data.reduce(
    (accumulator, row) => ({
      ...accumulator,
      [row.section_key]: row.content,
    }),
    {}
  );

  return normalizePortfolio(payload);
};

export const fetchPortfolio = unstable_cache(
  fetchPortfolioUncached,
  ["portfolio-content-v1"],
  { revalidate: 3600, tags: [PORTFOLIO_CACHE_TAG] }
);

const fetchSiteProfileUncached = async () => {
  const defaultProfile = { image: { src: "", alt: "Naila Azahra profile photo" } };
  const supabase = getSupabaseAdminClient();
  if (!supabase) return defaultProfile;

  const { data, error } = await supabase
    .from("portfolio_content")
    .select("content")
    .eq("section_key", "site_profile")
    .maybeSingle();

  if (error || !data?.content) return defaultProfile;
  return {
    ...defaultProfile,
    ...data.content,
    image: { ...defaultProfile.image, ...(data.content.image ?? {}) },
  };
};

export const fetchSiteProfile = unstable_cache(
  fetchSiteProfileUncached,
  ["site-profile-v1"],
  { revalidate: 3600, tags: [PROFILE_CACHE_TAG] }
);

export const fetchContactMessages = async () => {
  const supabase = getSupabaseAdminClient();
  if (!supabase || getSupabaseKeyMode() !== "service") return [];

  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  return error ? [] : data ?? [];
};

export const createContactMessage = async ({ name, email, message }) => {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Message service is not configured." };

  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  return error ? { ok: false, error: error.message } : { ok: true };
};

export const fetchAchievementBySlug = async (slug) => {
  const portfolio = await fetchPortfolio();
  return (
    portfolio.achievements.find((item) => item.slug === slug && item.isActive !== false) || null
  );
};

export const replacePortfolio = async (payload) => {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const normalized = normalizePortfolio(payload);
  const rows = Object.entries(normalized).map(([sectionKey, content]) => ({
    section_key: sectionKey,
    content,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("portfolio_content").upsert(rows, {
    onConflict: "section_key",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
};

export const replaceSiteProfile = async (profile) => {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { error } = await supabase.from("portfolio_content").upsert(
    {
      section_key: "site_profile",
      content: profile,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "section_key" }
  );

  return error ? { ok: false, error: error.message } : { ok: true };
};
