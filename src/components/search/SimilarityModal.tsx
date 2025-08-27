import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Download, 
  ExternalLink,
  Star,
  GitFork,
  Code,
  Target,
  Zap,
  Brain,
  CheckCircle2
} from 'lucide-react';
import { EnhancedRepository } from '@/types/search';

interface SimilarityModalProps {
  repository: EnhancedRepository | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (repo: EnhancedRepository, format: 'zip' | 'html') => void;
}

export const SimilarityModal = ({ repository, isOpen, onClose, onDownload }: SimilarityModalProps) => {
  if (!repository || !repository.similarity) return null;

  const { similarity } = repository;
  
  const metrics = [
    {
      label: 'Content Similarity',
      value: similarity.contentSimilarity,
      icon: Code,
      description: 'Similarity in code structure, patterns, and implementation approaches'
    },
    {
      label: 'Requirement Similarity',
      value: similarity.requirementSimilarity,
      icon: CheckCircle2,
      description: 'Alignment with functional and non-functional requirements'
    },
    {
      label: 'Working Similarity',
      value: similarity.workingSimilarity,
      icon: Zap,
      description: 'Operational compatibility and execution environment alignment'
    },
    {
      label: 'Purpose Similarity',
      value: similarity.purposeSimilarity,
      icon: Target,
      description: 'Alignment in project goals, use cases, and intended outcomes'
    },
    {
      label: 'Semantic Similarity',
      value: similarity.semanticSimilarity,
      icon: Brain,
      description: 'Conceptual and domain-specific knowledge alignment'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600';
    if (score >= 90) return 'text-blue-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 95) return 'bg-emerald-500';
    if (score >= 90) return 'bg-blue-500';
    if (score >= 85) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Similarity Analysis Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repository Header */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{repository.full_name}</h3>
              {repository.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {repository.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4" />
                  {repository.stargazers_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <GitFork className="h-4 w-4" />
                  {repository.forks_count.toLocaleString()}
                </span>
                {repository.language && (
                  <Badge variant="outline" className="text-xs">
                    {repository.language}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(similarity.overallSimilarity)}`}>
                {similarity.overallSimilarity}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Similarity</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Detailed Analysis</h4>
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{metric.label}</span>
                    </div>
                    <span className={`font-semibold ${getScoreColor(metric.value)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${getProgressColor(metric.value)} ${metric.value}%, #e5e7eb ${metric.value}%)`
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Analysis Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h5 className="font-medium mb-2">Analysis Summary</h5>
            <p className="text-sm text-muted-foreground">
              This repository shows <strong className={getScoreColor(similarity.overallSimilarity)}>
                {similarity.overallSimilarity >= 95 ? 'excellent' : 
                 similarity.overallSimilarity >= 90 ? 'very good' :
                 similarity.overallSimilarity >= 85 ? 'good' : 'moderate'}
              </strong> alignment with your search criteria. 
              {similarity.overallSimilarity >= 90 && (
                <> The high similarity scores across multiple dimensions indicate this repository could be highly relevant for your needs.</>
              )}
              {similarity.overallSimilarity < 90 && similarity.overallSimilarity >= 80 && (
                <> Consider reviewing the specific metrics to understand areas of alignment and divergence.</>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            {onDownload && (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDownload(repository, 'zip')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download ZIP
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDownload(repository, 'html')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};