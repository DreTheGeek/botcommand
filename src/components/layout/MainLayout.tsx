import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopNav } from './TopNav';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full nexus-bg-animated">
        <div className="nexus-particles" />
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopNav />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
