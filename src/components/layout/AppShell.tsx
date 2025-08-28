import React, { useState, useCallback, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { NavigationPanel } from '@/components/navigation/NavigationPanel';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { UserMenu } from './UserMenu';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
  canClose?: boolean;
}

interface AppShellProps {
  children?: React.ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  theme, 
  onThemeToggle, 
  activeView, 
  onViewChange 
}) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'home', title: 'Home', content: null, canClose: false } // Initialize content as null
  ]);
  const [activeTab, setActiveTab] = useState('home');
  const [navExpanded, setNavExpanded] = useState(true);

  // Update the home tab content and title when children or activeView changes
  useEffect(() => {
    const getViewTitle = (view: string) => {
      switch (view) {
        case 'github-search': return 'Github Search';
        case 'chat': return 'Chat';
        case 'history': return 'History';
        case 'dashboard':
        case 'home': return 'Home';
        default: return view.charAt(0).toUpperCase() + view.slice(1);
      }
    };

    setTabs(prev => prev.map(tab => 
      tab.id === 'home' ? { 
        ...tab, 
        content: children,
        title: getViewTitle(activeView)
      } : tab
    ));
  }, [children, activeView]);

  const addTab = useCallback((tab: Tab) => {
    setTabs(prev => [...prev, tab]);
    setActiveTab(tab.id);
  }, []);

  const closeTab = useCallback((id: string) => {
    if (id === 'home') return; // Can't close home tab
    
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (activeTab === id && newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      }
      return newTabs;
    });
  }, [activeTab]);

  const toggleNav = useCallback(() => {
    setNavExpanded(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Collapsible Navigation */}
      <motion.div 
        className="flex-shrink-0 bg-sidebar h-full border-r border-sidebar-border"
        animate={{ width: navExpanded ? '240px' : '64px' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <NavigationPanel
          isOpen={navExpanded}
          activeView={activeView}
          theme={theme}
          onViewChange={onViewChange}
          onThemeToggle={onThemeToggle}
          onClose={() => setNavExpanded(false)}
        />
      </motion.div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="h-14 border-b bg-background/80 backdrop-blur-sm flex items-center px-4 z-10">
          {/* Navigation Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleNav}
            className="mr-3"
          >
            <div className="flex flex-col gap-1">
              <div className="w-4 h-0.5 bg-current" />
              <div className="w-4 h-0.5 bg-current" />
              <div className="w-4 h-0.5 bg-current" />
            </div>
          </Button>
          
          {/* Breadcrumb Area */}
          <div className="flex-1 flex items-center">
            <span className="text-sm font-medium capitalize">
              {activeView.replace('-', ' ')}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <CommandPalette onCommand={(command) => {
              if (command.type === 'navigate') {
                onViewChange(command.target);
              } else if (command.type === 'newTab') {
                addTab({
                  id: `tab-${Date.now()}`,
                  title: command.title || 'New Tab',
                  content: command.content || <div>New Tab Content</div>,
                  canClose: true
                });
              }
            }} />
            <NotificationCenter />
            <UserMenu theme={theme} onThemeToggle={onThemeToggle} />
          </div>
        </div>
        
        {/* Tab Bar */}
        <div className="border-b bg-muted/30 flex overflow-x-auto">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`flex items-center px-4 py-2 text-sm cursor-pointer border-r hover:bg-muted/50 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-background border-b-2 border-primary' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="whitespace-nowrap">{tab.title}</span>
              {tab.canClose && (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          <Button 
            variant="ghost"
            size="sm"
            className="px-3 text-muted-foreground hover:text-foreground"
            onClick={() => addTab({
              id: `tab-${Date.now()}`,
              title: 'New Tab',
              content: <div className="p-6 text-center text-muted-foreground">New tab content</div>,
              canClose: true
            })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {tabs.map(tab => (
              <motion.div 
                key={tab.id}
                className={`absolute inset-0 ${activeTab === tab.id ? 'block' : 'hidden'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {tab.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};