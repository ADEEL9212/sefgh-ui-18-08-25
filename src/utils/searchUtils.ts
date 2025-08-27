import { SearchHistory, SearchType, SimilarityMetrics, LanguageStats, SearchMetrics } from '@/types/search';

export const SEARCH_HISTORY_KEY = 'github-search-history';
export const MAX_HISTORY_ITEMS = 10;

export const saveSearchHistory = (query: string, resultCount: number, searchType: SearchType): void => {
  try {
    const history = getSearchHistory();
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultCount,
      searchType,
    };

    const updatedHistory = [newEntry, ...history.filter(item => item.query !== query)]
      .slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
};

export const getSearchHistory = (): SearchHistory[] => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored);
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load search history:', error);
    return [];
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
};

// Generate realistic similarity scores for development
export const generateSimilarityMetrics = (): SimilarityMetrics => {
  const generateScore = () => Math.floor(Math.random() * 21) + 80; // 80-100%
  
  const contentSimilarity = generateScore();
  const requirementSimilarity = generateScore();
  const workingSimilarity = generateScore();
  const purposeSimilarity = generateScore();
  const semanticSimilarity = generateScore();
  
  const overallSimilarity = Math.floor(
    (contentSimilarity + requirementSimilarity + workingSimilarity + purposeSimilarity + semanticSimilarity) / 5
  );

  return {
    contentSimilarity,
    requirementSimilarity,
    workingSimilarity,
    purposeSimilarity,
    semanticSimilarity,
    overallSimilarity,
  };
};

export const calculateLanguageStats = (repositories: any[]): LanguageStats[] => {
  const languageMap = new Map<string, { count: number; totalStars: number }>();

  repositories.forEach(repo => {
    if (repo.language) {
      const existing = languageMap.get(repo.language) || { count: 0, totalStars: 0 };
      languageMap.set(repo.language, {
        count: existing.count + 1,
        totalStars: existing.totalStars + repo.stargazers_count,
      });
    }
  });

  const total = repositories.length;
  return Array.from(languageMap.entries())
    .map(([language, data]) => ({
      language,
      count: data.count,
      percentage: Math.round((data.count / total) * 100),
      totalStars: data.totalStars,
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateSearchMetrics = (repositories: any[], searchTime: number): SearchMetrics => {
  const languageStats = calculateLanguageStats(repositories);
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

  return {
    totalRepositories: repositories.length,
    uniqueLanguages: languageStats.length,
    mostPopularLanguage: languageStats[0]?.language || 'Unknown',
    averageStars: repositories.length > 0 ? Math.round(totalStars / repositories.length) : 0,
    averageForks: repositories.length > 0 ? Math.round(totalForks / repositories.length) : 0,
    searchTime,
  };
};

export const formatSearchTime = (time: number): string => {
  if (time < 1000) {
    return `${time}ms`;
  }
  return `${(time / 1000).toFixed(2)}s`;
};

export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query.trim()) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }

  if (query.length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters' };
  }

  if (query.length > 256) {
    return { isValid: false, error: 'Search query must be less than 256 characters' };
  }

  // Check for potentially harmful patterns
  const harmfulPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
  if (harmfulPatterns.some(pattern => pattern.test(query))) {
    return { isValid: false, error: 'Invalid characters in search query' };
  }

  return { isValid: true };
};

export const buildGitHubSearchQuery = (query: string, searchType: SearchType): string => {
  const baseQuery = encodeURIComponent(query);
  
  if (searchType === 'exhaustive') {
    // Add additional search parameters for exhaustive search
    return `${baseQuery}&sort=stars&order=desc&per_page=50`;
  }
  
  // Quick search with fewer results
  return `${baseQuery}&sort=stars&order=desc&per_page=20`;
};