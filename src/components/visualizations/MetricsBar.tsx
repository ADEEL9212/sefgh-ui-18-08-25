import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  Code, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { SearchMetrics } from '@/types/search';
import { formatSearchTime } from '@/utils/searchUtils';

interface MetricsBarProps {
  metrics: SearchMetrics;
  isVisible?: boolean;
}

export const MetricsBar = ({ metrics, isVisible = true }: MetricsBarProps) => {
  if (!isVisible) return null;

  const metricItems = [
    {
      icon: FolderGit2,
      label: 'Total Repositories',
      value: metrics.totalRepositories.toLocaleString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50'
    },
    {
      icon: Code,
      label: 'Unique Languages',
      value: metrics.uniqueLanguages.toString(),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50'
    },
    {
      icon: TrendingUp,
      label: 'Most Popular',
      value: metrics.mostPopularLanguage,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50'
    },
    {
      icon: Star,
      label: 'Avg Stars',
      value: metrics.averageStars.toLocaleString(),
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/50'
    },
    {
      icon: GitFork,
      label: 'Avg Forks',
      value: metrics.averageForks.toLocaleString(),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/50'
    },
    {
      icon: Clock,
      label: 'Search Time',
      value: formatSearchTime(metrics.searchTime),
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-950/50'
    }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metricItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-2 p-3 rounded-lg ${item.bgColor} transition-all duration-200 hover:scale-105`}
              >
                <div className={`p-1.5 rounded-md bg-white dark:bg-gray-800 shadow-sm`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold truncate" title={item.value}>
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};