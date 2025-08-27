import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  fullscreenComponent: string | null;
  toggleFullscreen: (componentId?: string) => void;
  exitFullscreen: () => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};

interface FullscreenProviderProps {
  children: ReactNode;
}

export const FullscreenProvider: React.FC<FullscreenProviderProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenComponent, setFullscreenComponent] = useState<string | null>(null);

  // Load saved preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('sefgh-fullscreen-preference');
    if (savedPreference) {
      try {
        const { isFullscreen: saved, component } = JSON.parse(savedPreference);
        if (saved && component) {
          setIsFullscreen(true);
          setFullscreenComponent(component);
        }
      } catch (error) {
        console.warn('Failed to load fullscreen preference:', error);
      }
    }
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    const preference = {
      isFullscreen,
      component: fullscreenComponent
    };
    localStorage.setItem('sefgh-fullscreen-preference', JSON.stringify(preference));
  }, [isFullscreen, fullscreenComponent]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
      // Alt+F to toggle fullscreen for current component
      if (event.altKey && event.key === 'f' && fullscreenComponent) {
        event.preventDefault();
        toggleFullscreen(fullscreenComponent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, fullscreenComponent]);

  const toggleFullscreen = (componentId?: string) => {
    if (isFullscreen && fullscreenComponent === componentId) {
      // Exit fullscreen if same component
      exitFullscreen();
    } else if (componentId) {
      // Enter fullscreen for specific component
      setIsFullscreen(true);
      setFullscreenComponent(componentId);
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenComponent(null);
  };

  const value: FullscreenContextType = {
    isFullscreen,
    fullscreenComponent,
    toggleFullscreen,
    exitFullscreen
  };

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
};