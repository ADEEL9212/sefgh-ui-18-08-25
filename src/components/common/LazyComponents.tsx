import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components for better mobile performance
export const LazySearchPanel = lazy(() => 
  import('../search/SearchPanel').then(module => ({ default: module.SearchPanel }))
);

export const LazyWorkbenchPanel = lazy(() => 
  import('../workbench/WorkbenchPanel').then(module => ({ default: module.WorkbenchPanel }))
);

export const LazyNavigationPanel = lazy(() => 
  import('../navigation/NavigationPanel').then(module => ({ default: module.NavigationPanel }))
);

export const LazyEnhancedHistoryPanel = lazy(() => 
  import('../chat/EnhancedHistoryPanel').then(module => ({ default: module.EnhancedHistoryPanel }))
);

// Loading component for lazy-loaded components
export const LazyLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
  </div>
);

// Wrapper component for lazy loading with error boundary
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback = <LazyLoadingSpinner /> }: LazyWrapperProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);