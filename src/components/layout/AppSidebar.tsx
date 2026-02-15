import {
  Home,
  DollarSign,
  Calendar,
  BarChart3,
  Search,
  Database,
  Settings,
  Briefcase,
  TrendingUp,
  ShoppingBag,
  Video,
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
  { title: 'Revenue Hub', url: '/revenue', icon: DollarSign },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Raw Data', url: '/data', icon: Database },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const botNav = [
  { title: 'Ronnie Realty', url: '/bots/ronnie', icon: Home },
  { title: 'Ana Sales Analyst', url: '/bots/ana', icon: Briefcase },
  { title: 'Tammy Trader', url: '/bots/trading', icon: TrendingUp },
  { title: 'Rhianna Research', url: '/bots/rhianna', icon: Search },
  { title: 'Deondre Dropshipping', url: '/bots/deondre', icon: ShoppingBag },
  { title: 'Carter Content', url: '/bots/carter', icon: Video },
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
