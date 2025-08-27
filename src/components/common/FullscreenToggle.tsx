import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/contexts/FullscreenContext';
import { cn } from '@/lib/utils';

interface FullscreenToggleProps {
  componentId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  componentId,
  className,
  size = 'sm',
  variant = 'ghost'
}) => {
  const { isFullscreen, fullscreenComponent, toggleFullscreen } = useFullscreen();
  
  const isCurrentlyFullscreen = isFullscreen && fullscreenComponent === componentId;
  const Icon = isCurrentlyFullscreen ? Minimize2 : Maximize2;
  const tooltipText = isCurrentlyFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen (Alt+F)';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => toggleFullscreen(componentId)}
      className={cn(
        'transition-all duration-200 hover:scale-105',
        'min-h-[44px] min-w-[44px]', // Touch-friendly size
        className
      )}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};