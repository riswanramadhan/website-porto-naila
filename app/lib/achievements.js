export {
  fetchAchievementBySlug,
  isSupabaseConfigured,
  replacePortfolio as replaceAchievements,
} from "./portfolio";

export const fetchAchievements = async () => {
  const { fetchPortfolio } = await import("./portfolio");
  const portfolio = await fetchPortfolio();
  return portfolio.achievements;
};
