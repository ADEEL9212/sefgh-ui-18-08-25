import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X,
  Loader2,
  RefreshCw,
  BarChart3,
  Download,
  Grid3X3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { EnhancedSearchInput } from './EnhancedSearchInput';
import { EnhancedRepositoryCard } from './EnhancedRepositoryCard';
import { SimilarityModal } from './SimilarityModal';
import { MetricsBar } from '../visualizations/MetricsBar';
import { VisualizationCharts } from '../visualizations/VisualizationCharts';
import { 
  EnhancedRepository, 
  SearchType, 
  SearchState, 
  SearchMetrics 
} from '@/types/search';
import { 
  saveSearchHistory, 
  generateSimilarityMetrics, 
  calculateSearchMetrics,
  calculateLanguageStats,
  buildGitHubSearchQuery
} from '@/utils/searchUtils';

interface SearchPanelProps {
  isVisible: boolean;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoSearchQuery?: string;
  onQueryProcessed?: () => void;
}

export const SearchPanel = ({ isVisible, onClose, inputRef, autoSearchQuery, onQueryProcessed }: SearchPanelProps) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    repositories: [],
    loading: false,
    error: null,
    searchType: 'quick',
    metrics: null,
    history: []
  });
  
  const [selectedRepository, setSelectedRepository] = useState<EnhancedRepository | null>(null);
  const [showSimilarityModal, setShowSimilarityModal] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const { toast } = useToast();

  const handleRefresh = async () => {
    if (searchState.query.trim()) {
      await searchRepositories(searchState.query);
      toast({
        title: "Refreshed!",
        description: "Search results have been updated",
        duration: 2000,
      });
    }
  };

  const {
    elementRef,
    isRefreshing,
    pullDistance,
    isPulling,
    isTriggered
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: searchState.repositories.length > 0 && !searchState.loading
  });

  const searchRepositories = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const startTime = Date.now();
    setSearchState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const queryString = buildGitHubSearchQuery(searchQuery, searchState.searchType);
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${queryString}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      const searchTime = Date.now() - startTime;
      
      // Enhance repositories with similarity scores
      const enhancedRepos: EnhancedRepository[] = (data.items || []).map((repo: any) => ({
        ...repo,
        similarity: generateSimilarityMetrics(),
        downloadUrls: {
          zip: `${repo.html_url}/archive/refs/heads/${repo.default_branch || 'main'}.zip`,
          html: repo.html_url
        }
      }));

      const metrics = calculateSearchMetrics(enhancedRepos, searchTime);
      
      setSearchState(prev => ({
        ...prev,
        repositories: enhancedRepos,
        metrics,
        loading: false
      }));

      // Save to search history
      saveSearchHistory(searchQuery, enhancedRepos.length, searchState.searchType);

      toast({
        title: "Search completed!",
        description: `Found ${enhancedRepos.length} repositories in ${metrics.searchTime < 1000 ? metrics.searchTime + 'ms' : (metrics.searchTime / 1000).toFixed(2) + 's'}`,
        duration: 3000,
      });

    } catch (err) {
      setSearchState(prev => ({ 
        ...prev, 
        error: 'Failed to search repositories. Please try again.',
        loading: false 
      }));
      console.error('Search error:', err);
    }
  };

  const handleSearch = () => {
    searchRepositories(searchState.query);
  };

  const handleSimilarityReport = (repository: EnhancedRepository) => {
    setSelectedRepository(repository);
    setShowSimilarityModal(true);
  };

  const handleDownload = async (repository: EnhancedRepository, format: 'zip' | 'html') => {
    try {
      if (format === 'zip' && repository.downloadUrls?.zip) {
        window.open(repository.downloadUrls.zip, '_blank');
        toast({
          title: "Download started",
          description: `Downloading ${repository.full_name} as ZIP`,
          duration: 3000,
        });
      } else if (format === 'html') {
        window.open(repository.html_url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to start download",
        duration: 3000,
      });
    }
  };

  const handleBulkDownload = () => {
    // Implement bulk download functionality
    const downloadData = {
      query: searchState.query,
      searchType: searchState.searchType,
      timestamp: new Date().toISOString(),
      repositories: searchState.repositories.map(repo => ({
        name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        similarity: repo.similarity
      }))
    };

    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-search-${searchState.query.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Search results exported as JSON",
      duration: 3000,
    });
  };

  // Handle auto search when autoSearchQuery is provided
  useEffect(() => {
    if (autoSearchQuery && isVisible) {
      setQuery(autoSearchQuery);
      searchRepositories(autoSearchQuery);
      onQueryProcessed?.();
    }
  }, [autoSearchQuery, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed lg:static inset-0 lg:inset-auto
      w-full sm:w-96 lg:w-96 
      bg-surface lg:bg-sidebar
      border-l border-border
      z-40 lg:z-auto
      animate-slide-in-right
      flex flex-col
      transition-transform duration-300 ease-in-out
    `}>
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur-sm lg:bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">GitHub Search</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden min-h-[44px] min-w-[44px]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories..."
              className="pr-8 h-12 text-base" // Larger for mobile
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            type="submit" 
            size="sm" 
            disabled={loading}
            className="h-12 px-4 min-w-[48px]" // Larger touch target
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Results */}
      <div 
        ref={elementRef}
        className="flex-1 overflow-y-auto p-4 mobile-scroll mobile-pull-to-refresh smooth-scroll relative"
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Pull to refresh indicator */}
        {isPulling && (
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center h-16 w-16 bg-background/90 backdrop-blur-sm rounded-full border shadow-lg z-10"
            style={{
              opacity: Math.min(pullDistance / 80, 1),
              transform: `translate(-50%, ${Math.max(-64, -64 + pullDistance)}px) scale(${Math.min(pullDistance / 80, 1)})`
            }}
          >
            <RefreshCw 
              className={`h-5 w-5 text-primary ${isTriggered ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${pullDistance * 4}deg)`
              }}
            />
          </div>
        )}

        {/* Refreshing indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Refreshing...</span>
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <div className="skeleton h-5 w-16" />
                    <div className="skeleton h-5 w-16" />
                  </div>
                  <div className="skeleton h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && repositories.length === 0 && query && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No repositories found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}

        {!loading && repositories.length === 0 && !query && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start searching for GitHub repositories</p>
            <p className="text-sm">Enter a search term above</p>
          </div>
        )}

        <div className="space-y-4">
          {repositories.map((repo) => (
            <Card key={repo.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium leading-tight break-words">
                  {repo.full_name}
                </CardTitle>
                {repo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {repo.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count.toLocaleString()}
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <GitFork className="h-3 w-3" />
                    {repo.forks_count.toLocaleString()}
                  </Badge>
                  {repo.language && (
                    <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {formatDate(repo.updated_at)}
                  </span>
                  {repo.license && (
                    <span className="truncate ml-2">{repo.license.name}</span>
                  )}
                </div>

                {/* Mobile-optimized button layout */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(repo.html_url, 'Repository URL')}
                    className="flex-1 h-10 justify-center" // Larger touch target
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(repo.clone_url, 'Clone URL')}
                    className="flex-1 h-10 justify-center" // Larger touch target
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(repo.html_url, '_blank')}
                    className="sm:w-auto w-full h-10 justify-center" // Full width on mobile
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span className="sm:hidden">Open</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};