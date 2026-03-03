import {
  Home,
  DollarSign,
  Calendar,
  BarChart3,
  Search,
  Database,
  Settings,
  MessageCircle,
  Shield,
  Crown,
  Briefcase,
  Hammer,
  Video,
  Code,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Bot Chat', url: '/chat', icon: MessageCircle },
  { title: 'Revenue Hub', url: '/revenue', icon: DollarSign },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Raw Data', url: '/data', icon: Database },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const botNav = [
  { title: 'Optimus Prime', url: '/bots/optimus', icon: Shield },
  { title: 'Ava Analyst', url: '/bots/ava', icon: Crown },
  { title: 'Sarah Sales', url: '/bots/sarah', icon: Briefcase },
  { title: 'Rhianna Research', url: '/bots/rhianna', icon: Search },
  { title: 'Benny Builder', url: '/bots/benny', icon: Hammer },
  { title: 'Randy Realty', url: '/bots/randy', icon: Home },
  { title: 'Carter Content', url: '/bots/carter', icon: Video },
  { title: 'Cleah Coding', url: '/bots/cleah', icon: Code },
  { title: 'Tammy Trader', url: '/bots/tammy', icon: TrendingUp },
  { title: 'Deondre Dropshipping', url: '/bots/deondre', icon: ShoppingBag },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const renderItems = (items: typeof mainNav) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              end={item.url === '/'}
              className="hover:bg-sidebar-accent/50"
              activeClassName="bg-sidebar-accent text-primary font-medium"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(mainNav)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Bot Deep Dives
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(botNav)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
