import React, { useState, useEffect, useCallback } from 'react';
import { Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Command as CommandPrimitive, CommandItem, CommandList, CommandEmpty, CommandGroup } from '@/components/ui/command';

interface CommandAction {
  type: 'navigate' | 'newTab' | 'action';
  target?: string;
  title?: string;
  content?: React.ReactNode;
  action?: () => void;
}

interface CommandPaletteProps {
  onCommand: (command: CommandAction) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Register keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    {
      group: 'Navigation',
      items: [
        { id: 'chat', label: 'New Chat', description: 'Start a new conversation', target: 'chat' },
        { id: 'history', label: 'Chat History', description: 'View previous conversations', target: 'history' },
        { id: 'search', label: 'GitHub Search', description: 'Search repositories', target: 'github-search' },
        { id: 'docs', label: 'Documentation', description: 'Browse documentation', target: 'docs' },
        { id: 'playground', label: 'Playground', description: 'Interactive environment', target: 'playground' },
        { id: 'settings', label: 'Settings', description: 'Application settings', target: 'settings' },
      ]
    },
    {
      group: 'Actions',
      items: [
        { id: 'new-tab', label: 'New Tab', description: 'Open a new tab' },
        { id: 'toggle-theme', label: 'Toggle Theme', description: 'Switch between light and dark mode' },
        { id: 'copy-url', label: 'Copy URL', description: 'Copy current page URL' },
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const handleSelect = useCallback((command: any) => {
    setIsOpen(false);
    setQuery('');
    
    if (command.target) {
      onCommand({ type: 'navigate', target: command.target });
    } else if (command.id === 'new-tab') {
      onCommand({ type: 'newTab', title: 'New Tab' });
    } else if (command.id === 'toggle-theme') {
      onCommand({ type: 'action', action: () => {} });
    }
  }, [onCommand]);

  return (
    <>
      <Button 
        variant="outline"
        className="flex items-center gap-2 bg-background/50 hover:bg-background/80 border-muted text-muted-foreground h-8 px-3"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-3 w-3" />
        <span className="text-xs">Search or run a command...</span>
        <kbd className="ml-auto bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
          {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4 text-muted-foreground" />
              <Input
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0"
                placeholder="Search or run a command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </DialogHeader>
          
          <CommandPrimitive className="max-h-[400px]">
            <CommandList className="p-2">
              <CommandEmpty>No results found.</CommandEmpty>
              {filteredCommands.map(group => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map(item => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex flex-col items-start gap-1 px-3 py-2 cursor-pointer"
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
    </>
  );
};