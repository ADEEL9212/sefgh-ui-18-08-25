import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Zap, 
  Github, 
  BookOpen, 
  Settings,
  History,
  Plus,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface DashboardProps {
  userName?: string;
  isFirstVisit?: boolean;
  onNavigate: (view: string) => void;
  onNewChat: () => void;
  onToggleSearch: () => void;
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  delay?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  onClick, 
  delay = 0 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
    whileTap={{ scale: 0.98 }}
    className={`${color} rounded-xl p-6 text-white cursor-pointer relative overflow-hidden`}
    onClick={onClick}
  >
    <div className="relative z-10">
      <Icon className="h-8 w-8 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
  </motion.div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName = 'there', 
  isFirstVisit = false, 
  onNavigate,
  onNewChat,
  onToggleSearch
}) => {
  const quickActions = [
    {
      icon: MessageSquare,
      title: 'New Conversation',
      description: 'Start a fresh chat about anything',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      onClick: onNewChat,
    },
    {
      icon: Search,
      title: 'GitHub Search',
      description: 'Find repositories and code',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      onClick: () => onNavigate('github-search'),
    },
    {
      icon: Clock,
      title: 'Recent Activity',
      description: 'Pick up where you left off',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      onClick: () => onNavigate('history'),
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Tools and shortcuts',
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
      onClick: () => onNavigate('all-pages'),
    },
  ];

  const recentActivities = [
    { title: 'Searched React repositories', time: '2 hours ago', type: 'search' },
    { title: 'Asked about TypeScript best practices', time: '1 day ago', type: 'chat' },
    { title: 'Explored Next.js documentation', time: '2 days ago', type: 'docs' },
  ];

  const popularActions = [
    { icon: Github, label: 'Browse Repositories', count: '1.2k searches today' },
    { icon: BookOpen, label: 'Read Documentation', count: '856 views today' },
    { icon: Settings, label: 'Customize Settings', count: '234 configs today' },
  ];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          What would you like to explore today?
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={action.title}
            icon={action.icon}
            title={action.title}
            description={action.description}
            color={action.color}
            onClick={action.onClick}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('history')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularActions.map((action, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => onNavigate(action.label.toLowerCase().replace(' ', '-'))}
                >
                  <action.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.count}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onNewChat}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask a Question
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate('github-search')}
              >
                <Search className="mr-2 h-4 w-4" />
                Search GitHub
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate('playground')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Open Playground
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
              <h3 className="text-lg font-semibold">💡 Pro Tip</h3>
            </div>
            <p className="text-muted-foreground">
              Use <kbd className="bg-muted px-2 py-1 rounded text-xs font-mono">Cmd+K</kbd> (or <kbd className="bg-muted px-2 py-1 rounded text-xs font-mono">Ctrl+K</kbd>) 
              to open the command palette and quickly navigate anywhere in the app!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};