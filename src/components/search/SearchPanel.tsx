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
import { useFullscreen } from '@/contexts/FullscreenContext';
import { FullscreenToggle } from '@/components/common/FullscreenToggle';
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
  asMainView?: boolean; // New prop to indicate if it's used as main view
}

export const SearchPanel = ({ isVisible, onClose, inputRef, autoSearchQuery, onQueryProcessed, asMainView = false }: SearchPanelProps) => {
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
  const { isFullscreen, fullscreenComponent } = useFullscreen();
  
  // Component identifier for fullscreen
  const componentId = 'github-search';
  const isComponentFullscreen = isFullscreen && fullscreenComponent === componentId;

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
      setSearchState(prev => ({ ...prev, query: autoSearchQuery }));
      searchRepositories(autoSearchQuery);
      onQueryProcessed?.();
    }
  }, [autoSearchQuery, isVisible]);

  if (!isVisible && !isComponentFullscreen) return null;

  const languageStats = searchState.repositories.length > 0 
    ? calculateLanguageStats(searchState.repositories) 
    : [];

  return (
    <>
      <div className={`
        ${asMainView 
          ? 'w-full h-full bg-background relative' 
          : isComponentFullscreen 
            ? 'fixed inset-0 w-full z-50 bg-background' 
            : 'fixed lg:static inset-0 lg:inset-auto w-full sm:w-96 lg:w-[600px] xl:w-[800px] bg-surface lg:bg-sidebar border-l border-border z-40 lg:z-auto'
        }
        ${!asMainView ? 'animate-slide-in-right' : ''}
        flex flex-col
        transition-all duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b bg-background/95 backdrop-blur-sm lg:bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Enhanced GitHub Search</h2>
            <div className="flex items-center gap-2">
              {searchState.repositories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDownload}
                  className="hidden sm:flex"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
              <FullscreenToggle 
                componentId={componentId}
                className="hidden sm:flex"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={isComponentFullscreen ? "min-h-[44px] min-w-[44px]" : "lg:hidden min-h-[44px] min-w-[44px]"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Search Input */}
          <EnhancedSearchInput
            query={searchState.query}
            searchType={searchState.searchType}
            loading={searchState.loading}
            onQueryChange={(query) => setSearchState(prev => ({ ...prev, query }))}
            onSearchTypeChange={(type) => setSearchState(prev => ({ ...prev, searchType: type }))}
            onSearch={handleSearch}
            onClear={() => setSearchState(prev => ({ ...prev, query: '' }))}
            inputRef={inputRef}
          />
        </div>

        {/* Results */}
        <div 
          ref={elementRef}
          className="flex-1 overflow-y-auto mobile-pull-to-refresh p-4 space-y-4"
        >
          {/* Pull to refresh indicator */}
          {isPulling && (
            <div className="flex justify-center py-2">
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

          {/* Error display */}
          {searchState.error && (
            <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
              {searchState.error}
            </div>
          )}

          {/* Loading skeleton */}
          {searchState.loading && (
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

          {/* Search Results */}
          {!searchState.loading && searchState.repositories.length > 0 && (
            <>
              {/* Metrics Bar */}
              {searchState.metrics && (
                <MetricsBar metrics={searchState.metrics} />
              )}

              {/* Tabbed Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="results" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Results</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-4 mt-4">
                  <div className={`grid gap-4 ${
                    isComponentFullscreen 
                      ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' 
                      : 'grid-cols-1 lg:grid-cols-2'
                  }`}>
                    {searchState.repositories.map((repo) => (
                      <EnhancedRepositoryCard
                        key={repo.id}
                        repository={repo}
                        onSimilarityReport={handleSimilarityReport}
                        onDownload={handleDownload}
                        showSimilarity={true}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-4">
                  <VisualizationCharts
                    repositories={searchState.repositories}
                    languageStats={languageStats}
                  />
                </TabsContent>

                <TabsContent value="export" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={handleBulkDownload}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export All Results as JSON
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Export includes repository metadata, similarity scores, and search parameters.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* No results */}
          {!searchState.loading && searchState.repositories.length === 0 && searchState.query && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No repositories found</p>
              <p className="text-sm">Try a different search term or adjust your search type</p>
            </div>
          )}

          {/* Initial state */}
          {!searchState.loading && searchState.repositories.length === 0 && !searchState.query && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enhanced GitHub Search</p>
              <p className="text-sm">Search with advanced similarity analysis and visualizations</p>
            </div>
          )}
        </div>
      </div>

      {/* Similarity Modal */}
      <SimilarityModal
        repository={selectedRepository}
        isOpen={showSimilarityModal}
        onClose={() => {
          setShowSimilarityModal(false);
          setSelectedRepository(null);
        }}
        onDownload={handleDownload}
      />
    </>
  );
};