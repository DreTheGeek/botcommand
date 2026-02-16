import { motion } from 'framer-motion';
import { Home, Briefcase, TrendingUp, Search, ShoppingBag, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePropertyDeals, useTrades, useDeals, useProducts, useOpportunities, useContentPosts, useEcosystemHealth } from '@/hooks/useExternalData';
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

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function BotStatusGrid() {
  const navigate = useNavigate();
  const { data: propertyDeals, isLoading: loadingDeals } = usePropertyDeals();
  const { data: deals, isLoading: loadingAna } = useDeals();
  const { data: trades, isLoading: loadingTrades } = useTrades();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: opportunities, isLoading: loadingOpps } = useOpportunities();
  const { data: contentPosts, isLoading: loadingContent } = useContentPosts();
  const { data: healthData } = useEcosystemHealth();

  const isLoading = loadingDeals || loadingAna || loadingTrades || loadingProducts || loadingOpps || loadingContent;

  const getMetric = (botId: string): { status: string; metric: string } => {
    // Try ecosystem_health first for status
    const ext = (healthData || []).find((h: any) => h.bot_id === botId);
    const baseStatus = ext?.status || 'Active';

    switch (botId) {
      case 'ronnie': {
        const hotDeals = (propertyDeals || []).filter((d: any) => (Number(d.net_profit) || 0) >= 40000);
        if (hotDeals.length > 0) return { status: 'Active', metric: `${hotDeals.length} hot deal${hotDeals.length !== 1 ? 's' : ''} (${fmt(hotDeals[0]?.net_profit ?? 0)} profit)` };
        return { status: baseStatus, metric: (propertyDeals || []).length > 0 ? `${(propertyDeals || []).length} deal${(propertyDeals || []).length !== 1 ? 's' : ''} found` : 'Scanning...' };
      }
      case 'ana': {
        const activeDeals = (deals || []).filter((d: any) => ['proposal_sent', 'negotiation'].includes(d.stage));
        const pipeline = activeDeals.reduce((s: number, d: any) => s + (Number(d.deal_size) || 0), 0);
        if (pipeline > 0) return { status: 'Active', metric: `${fmt(pipeline)} in pipeline` };
        return { status: baseStatus, metric: (deals || []).length > 0 ? `${(deals || []).length} deal${(deals || []).length !== 1 ? 's' : ''} tracked` : 'Prospecting...' };
      }
      case 'trading': {
        const closedTrades = (trades || []).filter((t: any) => t.status === 'closed');
        const totalPnl = closedTrades.reduce((s: number, t: any) => s + (Number(t.pnl) || 0), 0);
        const wins = closedTrades.filter((t: any) => (Number(t.pnl) || 0) > 0).length;
        const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;
        if (closedTrades.length > 0) return { status: 'Active', metric: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)} (${winRate}% win)` };
        return { status: baseStatus, metric: (trades || []).length > 0 ? `${(trades || []).length} open position${(trades || []).length !== 1 ? 's' : ''}` : 'Watching markets...' };
      }
      case 'rhianna': {
        const oppCount = (opportunities || []).length;
        const highPri = (opportunities || []).filter((o: any) => o.priority === 'high').length;
        if (oppCount > 0) return { status: 'Active', metric: `${oppCount} opportunit${oppCount !== 1 ? 'ies' : 'y'}${highPri > 0 ? ` (${highPri} high-pri)` : ''}` };
        return { status: baseStatus, metric: 'Scanning trends...' };
      }
      case 'deondre': {
        const scaling = (products || []).filter((p: any) => p.status === 'scaling');
        if (scaling.length > 0) {
          const roas = Number(scaling[0]?.avg_roas) || 0;
          return { status: 'Active', metric: `${scaling.length} scaling (${roas.toFixed(1)}x ROAS)` };
        }
        return { status: baseStatus, metric: (products || []).length > 0 ? `${(products || []).length} product${(products || []).length !== 1 ? 's' : ''} testing` : 'Finding winners...' };
      }
      case 'carter': {
        const posts = contentPosts || [];
        const totalViews = posts.reduce((s: number, p: any) => s + (Number(p.views) || Number(p.view_count) || 0), 0);
        if (posts.length > 0) return { status: 'Active', metric: totalViews > 0 ? `${totalViews.toLocaleString()} views` : `${posts.length} post${posts.length !== 1 ? 's' : ''} live` };
        return { status: baseStatus, metric: 'Creating content...' };
      }
      default:
        return { status: 'Idle', metric: 'Awaiting data...' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {BOT_DEFS.map((bot, i) => {
        const Icon = iconMap[bot.icon];
        const { status, metric } = getMetric(bot.id);
        const isActive = status !== 'Idle';
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
                        <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-nexus-success' : 'bg-muted-foreground/40'}`} />
                        <span className="text-xs text-muted-foreground">{status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{bot.description}</p>
                <div className="flex items-center justify-between">
                  {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <span className="text-sm font-mono font-semibold text-primary truncate mr-2">{metric}</span>
                  )}
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
