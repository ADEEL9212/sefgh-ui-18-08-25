import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  Clock, 
  Trash2, 
  Settings,
  Zap,
  Target
} from 'lucide-react';
import { SearchType, SearchHistory } from '@/types/search';
import { getSearchHistory, clearSearchHistory, validateSearchQuery } from '@/utils/searchUtils';

interface EnhancedSearchInputProps {
  query: string;
  searchType: SearchType;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSearchTypeChange: (type: SearchType) => void;
  onSearch: () => void;
  onClear: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const EnhancedSearchInput = ({
  query,
  searchType,
  loading,
  onQueryChange,
  onSearchTypeChange,
  onSearch,
  onClear,
  inputRef
}: EnhancedSearchInputProps) => {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load search history on mount
  useEffect(() => {
    const loadHistory = () => {
      const searchHistory = getSearchHistory();
      setHistory(searchHistory);
    };
    loadHistory();
  }, []);

  // Validate query on change
  useEffect(() => {
    if (query) {
      const validationResult = validateSearchQuery(query);
      setValidation(validationResult);
    } else {
      setValidation({ isValid: true });
    }
  }, [query]);

  const handleInputChange = (value: string) => {
    onQueryChange(value);
    setShowHistory(value.length > 0 && history.length > 0);
  };

  const handleHistorySelect = (historyItem: SearchHistory) => {
    onQueryChange(historyItem.query);
    onSearchTypeChange(historyItem.searchType);
    setShowHistory(false);
    // Trigger search automatically when selecting from history
    setTimeout(() => onSearch(), 100);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
    setShowHistory(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validation.isValid && !loading) {
      e.preventDefault();
      onSearch();
      setShowHistory(false);
    } else if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  const getSearchTypeIcon = (type: SearchType) => {
    return type === 'quick' ? <Zap className="h-4 w-4" /> : <Target className="h-4 w-4" />;
  };

  const getSearchTypeDescription = (type: SearchType) => {
    return type === 'quick' 
      ? 'Fast search with top 20 results' 
      : 'Comprehensive search with up to 50 results and detailed analysis';
  };

  return (
    <div className="space-y-3">
      {/* Search Type Selector */}
      <div className="flex items-center gap-2">
        <Label htmlFor="search-type" className="text-sm font-medium whitespace-nowrap">
          Search Type:
        </Label>
        <Select
          value={searchType}
          onValueChange={onSearchTypeChange}
          disabled={loading}
        >
          <SelectTrigger id="search-type" className="h-9 flex-1">
            <div className="flex items-center gap-2">
              {getSearchTypeIcon(searchType)}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="font-medium">Quick Search</div>
                  <div className="text-xs text-muted-foreground">Top 20 results, faster</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="exhaustive">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Exhaustive Search</div>
                  <div className="text-xs text-muted-foreground">Up to 50 results, detailed analysis</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Input with History */}
      <div className="relative">
        <Popover open={showHistory} onOpenChange={setShowHistory}>
          <PopoverTrigger asChild>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef || searchInputRef}
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowHistory(query.length > 0 && history.length > 0)}
                    placeholder={`Search GitHub repositories... (${getSearchTypeDescription(searchType)})`}
                    className={`pr-8 h-12 text-base ${
                      !validation.isValid ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                    disabled={loading}
                  />
                  {query && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onClear}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={onSearch}
                  disabled={loading || !validation.isValid || !query.trim()}
                  className="h-12 px-4 min-w-[48px]"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </PopoverTrigger>
          
          {/* Search History Dropdown */}
          {history.length > 0 && (
            <PopoverContent 
              className="w-full p-2" 
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm font-medium text-muted-foreground">Search History</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistorySelect(item)}
                      className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 truncate text-sm">{item.query}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.searchType === 'quick' ? 'Q' : 'E'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{item.resultCount} results</span>
                        <span>{item.timestamp.toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>

      {/* Validation Error */}
      {!validation.isValid && validation.error && (
        <div className="text-destructive text-sm px-1">
          {validation.error}
        </div>
      )}

      {/* Search Type Description */}
      <div className="text-xs text-muted-foreground px-1">
        {getSearchTypeDescription(searchType)}
      </div>
    </div>
  );
};