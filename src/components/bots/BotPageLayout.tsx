import { motion } from 'framer-motion';
import { Home, Briefcase, TrendingUp, Search, ShoppingBag, Video, Bot, Code2, Building2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const BOT_DEFS: Record<string, { name: string; icon: string; description: string }> = {
  ronnie: { name: 'Ronnie Realty', icon: 'Home', description: 'Finds $40K+ profit tax deed properties across 31 states' },
  ana: { name: 'Ana Sales Analyst', icon: 'Briefcase', description: 'Generates proposals, business plans, closes $25K-$85K deals' },
  trading: { name: 'Tammy Trader', icon: 'TrendingUp', description: 'Executes day trades, swing trades, manages portfolio with strict risk limits' },
  rhianna: { name: 'Rhianna Research', icon: 'Search', description: 'Tracks trends, competitors, opportunities before anyone else sees them' },
  deondre: { name: 'Deondre Dropshipping', icon: 'ShoppingBag', description: 'Tests products, manages suppliers, scales winners to $10K+/day' },
  carter: { name: 'Carter Content', icon: 'Video', description: 'Creates viral content across YouTube, TikTok, X, Instagram, LinkedIn daily' },
  optimus: { name: 'Optimus Prime', icon: 'Bot', description: 'Bot orchestrator — monitors all 9 bots and the shared knowledge base' },
  cleah: { name: 'Cleah Coding', icon: 'Code2', description: 'Software engineering expert for code review, debugging, and architecture' },
  benny: { name: 'Benny Business Maker', icon: 'Building2', description: 'Build, scale, and optimize businesses with actionable strategies' },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Briefcase, TrendingUp, Search, ShoppingBag, Video, Bot, Code2, Building2,
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
  const bot = BOT_DEFS[botId];
  if (!bot) return <div className="p-6">Bot not found</div>;

  const Icon = iconMap[bot.icon] || Home;

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
            <div className="h-2.5 w-2.5 rounded-full bg-nexus-success" />
            <Badge variant="outline" className="text-xs">Live Data</Badge>
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
