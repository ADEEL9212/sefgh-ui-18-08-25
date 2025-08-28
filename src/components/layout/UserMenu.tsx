import React from 'react';
import { User, Settings, LogOut, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserMenuProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ theme, onThemeToggle }) => {
  const userName = 'Florence Shaw'; // This could come from context/props
  const userEmail = 'florence@example.com';
  const userAvatar = '/placeholder-avatar.jpg';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onThemeToggle}>
          <Palette className="mr-2 h-4 w-4" />
          <span>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};