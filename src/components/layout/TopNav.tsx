import { useState } from 'react';
import { Bell, Moon, Sun, Search, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notifications, bots } from '@/data/mockData';
import { SidebarTrigger } from '@/components/ui/sidebar';

const priorityColors: Record<string, string> = {
  urgent: 'bg-nexus-urgent',
  action: 'bg-nexus-warning',
  win: 'bg-nexus-success',
  info: 'bg-nexus-info',
};

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifFilter, setNotifFilter] = useState<string>('all');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifs = notifications.filter(
    (n) => notifFilter === 'all' || n.priority === notifFilter
  );

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 gap-4">
      <SidebarTrigger className="mr-2" />

      {/* Logo */}
      <div className="flex items-center gap-2 min-w-fit">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">N</span>
        </div>
        <span className="text-lg font-bold tracking-tight hidden md:block">
          NEXUS
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties, deals, prospects, trades..."
          className="pl-9 bg-secondary/50 border-border/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-nexus-urgent text-[10px] font-bold flex items-center justify-center text-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Mark all read
              </Button>
            </div>
            <div className="flex gap-1 p-2 border-b border-border">
              {['all', 'urgent', 'action', 'win', 'info'].map((f) => (
                <Button
                  key={f}
                  variant={notifFilter === f ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs capitalize h-7"
                  onClick={() => setNotifFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifs.map((n) => {
                const bot = bots.find((b) => b.id === n.botId);
                return (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-border/50 hover:bg-secondary/50 cursor-pointer ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${priorityColors[n.priority]}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{n.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {bot?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {n.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
