import { motion } from 'framer-motion';
import { Home, Briefcase, TrendingUp, Search, ShoppingBag, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useBotData } from '@/hooks/useBotData';
import type { LucideIcon } from 'lucide-react';

const BOT_DEFS = [
  { id: 'ronnie', name: 'Ronnie Realty', icon: 'Home', description: 'Finds $40K+ profit tax deed properties across 31 states', route: '/bots/ronnie' },
  { id: 'ana', name: 'Ana Sales Analyst', icon: 'Briefcase', description: 'Generates proposals, business plans, closes $25K-$85K deals', route: '/bots/ana' },
  { id: 'trading', name: 'Tammy Trader', icon: 'TrendingUp', description: 'Executes day trades, swing trades, manages portfolio with strict risk limits', route: '/bots/trading' },
  { id: 'rhianna', name: 'Rhianna Research', icon: 'Search', description: 'Tracks trends, competitors, opportunities before anyone else sees them', route: '/bots/rhianna' },
  { id: 'deondre', name: 'Deondre Dropshipping', icon: 'ShoppingBag', description: 'Tests products, manages suppliers, scales winners to $10K+/day', route: '/bots/deondre' },
  { id: 'carter', name: 'Carter Content', icon: 'Video', description: 'Creates viral content across YouTube, TikTok, X, Instagram, LinkedIn daily', route: '/bots/carter' },
];

const iconMap: Record<string, LucideIcon> = { Home, Briefcase, TrendingUp, Search, ShoppingBag, Video };

export function BotStatusGrid() {
  const navigate = useNavigate();
  const { data: entries } = useBotData({ limit: 50 });

  const getLatestMetric = (botId: string) => {
    const botEntries = (entries || []).filter((e) => e.bot_id === botId || (botId === 'trading' && e.bot_id === 'tammy'));
    if (botEntries.length === 0) return 'Awaiting data...';
    const latest = botEntries[0];
    const d = latest.data as Record<string, any>;
    if (d.message) return d.message;
    if (d.symbol) return `${d.symbol}: ${d.result === 'W' ? '+' : ''}$${d.pnl || 0}`;
    if (d.address) return d.address;
    return `${latest.category} update`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {BOT_DEFS.map((bot, i) => {
        const Icon = iconMap[bot.icon];
        const hasData = (entries || []).some((e) => e.bot_id === bot.id || (bot.id === 'trading' && e.bot_id === 'tammy'));
        return (
          <motion.div key={bot.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
            <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/80 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{bot.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`h-2 w-2 rounded-full ${hasData ? 'bg-nexus-success' : 'bg-muted-foreground/40'}`} />
                        <span className="text-xs text-muted-foreground">{hasData ? 'Active' : 'Idle'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{bot.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-primary truncate mr-2">{getLatestMetric(bot.id)}</span>
                  <button className="text-xs h-7 text-primary hover:text-primary px-2" onClick={() => navigate(bot.route)}>View →</button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
