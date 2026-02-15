import { motion } from 'framer-motion';
import { Home, Briefcase, TrendingUp, Search, ShoppingBag, Video } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { bots } from '@/data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Briefcase, TrendingUp, Search, ShoppingBag, Video,
};

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface BotPageLayoutProps {
  botId: string;
  tabs: Tab[];
  defaultTab?: string;
}

export function BotPageLayout({ botId, tabs, defaultTab }: BotPageLayoutProps) {
  const bot = bots.find((b) => b.id === botId);
  if (!bot) return <div className="p-6">Bot not found</div>;

  const Icon = iconMap[bot.icon] || Home;
  const statusColor = bot.status === 'active' ? 'bg-[hsl(var(--nexus-success))]' : bot.status === 'attention' ? 'bg-[hsl(var(--nexus-warning))]' : 'bg-[hsl(var(--nexus-urgent))]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{bot.name}</h1>
            <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            <Badge variant="outline" className="text-xs capitalize">{bot.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{bot.description}</p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab || tabs[0]?.value} className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
