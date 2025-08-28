import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MessageSquare, Search, Code, BookOpen, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingAction {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}

interface FloatingActionMenuProps {
  onNavigate: (view: string) => void;
  onNewChat: () => void;
  onToggleSearch: () => void;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  onNavigate,
  onNewChat,
  onToggleSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: FloatingAction[] = [
    {
      icon: MessageSquare,
      label: 'New Chat',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        setIsOpen(false);
        onNewChat();
      }
    },
    {
      icon: Search,
      label: 'Search GitHub',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: () => {
        setIsOpen(false);
        onToggleSearch();
      }
    },
    {
      icon: Code,
      label: 'Playground',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        setIsOpen(false);
        onNavigate('playground');
      }
    },
    {
      icon: BookOpen,
      label: 'Documentation',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {
        setIsOpen(false);
        onNavigate('docs');
      }
    },
    {
      icon: Zap,
      label: 'Quick Actions',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => {
        setIsOpen(false);
        onNavigate('all-pages');
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => {
        setIsOpen(false);
        onNavigate('settings');
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 items-end">
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 20 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.2,
                  ease: 'easeOut'
                }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`${action.color} text-white shadow-lg border-0 h-12 px-4 rounded-full`}
                      onClick={action.onClick}
                    >
                      <action.icon className="h-5 w-5 mr-2" />
                      <span className="font-medium">{action.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg border-0 h-14 w-14 rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};