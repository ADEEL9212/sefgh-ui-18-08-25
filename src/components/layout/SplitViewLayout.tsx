import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SplitViewLayoutProps {
  children: React.ReactNode;
  contextPanel?: React.ReactNode;
  showContext?: boolean;
  onToggleContext?: () => void;
  title?: string;
  contextTitle?: string;
}

export const SplitViewLayout: React.FC<SplitViewLayoutProps> = ({
  children,
  contextPanel,
  showContext = true,
  onToggleContext,
  title = 'Main Content',
  contextTitle = 'Context'
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (isMaximized) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMaximize}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Main Content Panel */}
      <ResizablePanel defaultSize={showContext ? 70 : 100} minSize={50}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h2 className="font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleMaximize}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              {onToggleContext && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleContext}
                  className={showContext ? 'bg-muted' : ''}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </ResizablePanel>

      {/* Context Panel */}
      {showContext && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col bg-muted/20"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">{contextTitle}</h3>
                {onToggleContext && (
                  <Button variant="ghost" size="sm" onClick={onToggleContext}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                {contextPanel ? (
                  contextPanel
                ) : (
                  <div className="p-4 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Related Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            Context panel content will appear here based on your current activity.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          Export Chat
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          Share Link
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          Clear History
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </motion.div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};