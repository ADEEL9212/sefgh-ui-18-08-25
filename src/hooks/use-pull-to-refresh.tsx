import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    // Only trigger if we're at the top of the scroll
    const element = elementRef.current;
    if (!element || element.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!enabled || !isPulling || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, (currentY.current - startY.current) / resistance);
    
    // Only pull if we're at the top and pulling down
    const element = elementRef.current;
    if (!element || element.scrollTop > 0) return;
    
    setPullDistance(Math.min(distance, threshold * 1.5));
    
    // Prevent default scrolling when pulling
    if (distance > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!enabled || !isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const options = { passive: false };
    
    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);
    element.addEventListener('touchcancel', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, isPulling, pullDistance, threshold, isRefreshing]);

  return {
    elementRef,
    isRefreshing,
    pullDistance,
    isPulling,
    isTriggered: pullDistance >= threshold
  };
}