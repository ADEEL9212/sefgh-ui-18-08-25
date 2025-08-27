export interface Repository {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  license: { name: string } | null;
  updated_at: string;
  html_url: string;
  clone_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  size: number;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  private: boolean;
  created_at: string;
  pushed_at: string;
  open_issues_count: number;
  watchers_count: number;
  network_count: number;
  subscribers_count: number;
}

export interface SimilarityMetrics {
  contentSimilarity: number;
  requirementSimilarity: number;
  workingSimilarity: number;
  purposeSimilarity: number;
  semanticSimilarity: number;
  overallSimilarity: number;
}

export interface EnhancedRepository extends Repository {
  similarity?: SimilarityMetrics;
  downloadUrls?: {
    zip: string;
    html: string;
  };
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  searchType: SearchType;
}

export type SearchType = 'quick' | 'exhaustive';

export interface SearchMetrics {
  totalRepositories: number;
  uniqueLanguages: number;
  mostPopularLanguage: string;
  averageStars: number;
  averageForks: number;
  searchTime: number;
}

export interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  totalStars: number;
}

export interface SearchState {
  query: string;
  repositories: EnhancedRepository[];
  loading: boolean;
  error: string | null;
  searchType: SearchType;
  metrics: SearchMetrics | null;
  history: SearchHistory[];
}