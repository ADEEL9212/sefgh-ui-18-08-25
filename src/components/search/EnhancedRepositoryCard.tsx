import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Star, 
  GitFork, 
  Copy, 
  ExternalLink, 
  Calendar,
  Download,
  BarChart3,
  Eye,
  Archive,
  Lock,
  AlertCircle
} from 'lucide-react';
import { EnhancedRepository } from '@/types/search';
import { useToast } from '@/hooks/use-toast';

interface EnhancedRepositoryCardProps {
  repository: EnhancedRepository;
  onSimilarityReport: (repo: EnhancedRepository) => void;
  onDownload?: (repo: EnhancedRepository, format: 'zip' | 'html') => void;
  showSimilarity?: boolean;
}

export const EnhancedRepositoryCard = ({ 
  repository, 
  onSimilarityReport, 
  onDownload,
  showSimilarity = true 
}: EnhancedRepositoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50';
    if (score >= 90) return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50';
    if (score >= 85) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50';
    return 'text-orange-600 bg-orange-50 dark:bg-orange-950/50';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isHovered ? 'ring-2 ring-primary/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base line-clamp-1 mb-1">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {repository.full_name}
              </a>
            </CardTitle>
            {repository.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repository.description}
              </p>
            )}
          </div>
          
          {/* Repository Status Indicators */}
          <div className="flex flex-col gap-1">
            {repository.private && (
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>Private repository</TooltipContent>
              </Tooltip>
            )}
            {repository.archived && (
              <Tooltip>
                <TooltipTrigger>
                  <Archive className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>Archived repository</TooltipContent>
              </Tooltip>
            )}
            {repository.disabled && (
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>Disabled repository</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Similarity Score */}
        {showSimilarity && repository.similarity && (
          <div className="mt-2">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              getSimilarityColor(repository.similarity.overallSimilarity)
            }`}>
              <BarChart3 className="h-3 w-3" />
              {repository.similarity.overallSimilarity}% similarity
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats and Language */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            {formatNumber(repository.stargazers_count)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <GitFork className="h-3 w-3 mr-1" />
            {formatNumber(repository.forks_count)}
          </Badge>
          {repository.watchers_count > 0 && (
            <Badge variant="outline" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {formatNumber(repository.watchers_count)}
            </Badge>
          )}
          {repository.language && (
            <Badge variant="outline" className="text-xs">
              {repository.language}
            </Badge>
          )}
        </div>

        {/* Topics */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repository.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {repository.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{repository.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Date and License */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated {formatDate(repository.updated_at)}
          </span>
          {repository.license && (
            <span className="truncate ml-2">{repository.license.name}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(repository.html_url, 'Repository URL')}
              className="flex-1 h-9 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy URL
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-9 px-2"
            >
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="flex gap-1">
            {showSimilarity && repository.similarity && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSimilarityReport(repository)}
                className="flex-1 h-9 text-xs"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Report
              </Button>
            )}
            {onDownload && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(repository, 'zip')}
                className="h-9 px-2"
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};