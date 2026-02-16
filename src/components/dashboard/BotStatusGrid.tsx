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

  const getLoading = (botId: string): boolean => {
    switch (botId) {
      case 'ronnie': return loadingDeals;
      case 'ana': return loadingAna;
      case 'trading': return loadingTrades;
      case 'deondre': return loadingProducts;
      case 'rhianna': return loadingOpps;
      case 'carter': return loadingContent;
      default: return false;
    }
  };

  const getMetric = (botId: string): { status: string; metric: string } => {
    const ext = (healthData || []).find((h: any) => h.bot_id === botId);
    const baseStatus = ext?.status || 'Active';

    switch (botId) {
      case 'ronnie': {
        const d = propertyDeals || [];
        const hotDeals = d.filter((x: any) => (Number(x.net_profit) || 0) >= 40000);
        if (d.length === 0) return { status: baseStatus, metric: 'No data yet' };
        return { status: 'Active', metric: hotDeals.length > 0 ? `${hotDeals.length} hot deal${hotDeals.length !== 1 ? 's' : ''} (${fmt(hotDeals[0]?.net_profit ?? 0)} profit)` : `${d.length} deal${d.length !== 1 ? 's' : ''} found` };
      }
      case 'ana': {
        const d = deals || [];
        const active = d.filter((x: any) => ['proposal_sent', 'negotiation'].includes(x.stage));
        const pipeline = active.reduce((s: number, x: any) => s + (Number(x.deal_size) || 0), 0);
        if (d.length === 0) return { status: baseStatus, metric: 'No data yet' };
        return { status: 'Active', metric: pipeline > 0 ? `${fmt(pipeline)} in pipeline` : `${d.length} deal${d.length !== 1 ? 's' : ''} tracked` };
      }
      case 'trading': {
        const d = trades || [];
        const closed = d.filter((t: any) => t.status === 'closed');
        const totalPnl = closed.reduce((s: number, t: any) => s + (Number(t.pnl) || 0), 0);
        const wins = closed.filter((t: any) => (Number(t.pnl) || 0) > 0).length;
        const winRate = closed.length > 0 ? Math.round((wins / closed.length) * 100) : 0;
        if (d.length === 0) return { status: baseStatus, metric: 'No data yet' };
        return { status: 'Active', metric: closed.length > 0 ? `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)} (${winRate}% win)` : `${d.length} open position${d.length !== 1 ? 's' : ''}` };
      }
      case 'rhianna': {
        const d = opportunities || [];
        const highPri = d.filter((o: any) => o.priority === 'high').length;
        if (d.length === 0) return { status: baseStatus, metric: 'No data yet' };
        return { status: 'Active', metric: `${d.length} opportunit${d.length !== 1 ? 'ies' : 'y'}${highPri > 0 ? ` (${highPri} high-pri)` : ''}` };
      }
      case 'deondre': {
        const d = products || [];
        const scaling = d.filter((p: any) => p.status === 'scaling');
        if (d.length === 0) return { status: baseStatus, metric: 'No data yet' };
        if (scaling.length > 0) {
          const roas = Number(scaling[0]?.avg_roas) || 0;
          return { status: 'Active', metric: `${scaling.length} scaling (${roas.toFixed(1)}x ROAS)` };
        }
        return { status: baseStatus, metric: `${d.length} product${d.length !== 1 ? 's' : ''} testing` };
      }
      case 'carter': {
        const posts = contentPosts || [];
        const totalViews = posts.reduce((s: number, p: any) => s + (Number(p.views) || Number(p.view_count) || 0), 0);
        if (posts.length === 0) return { status: baseStatus, metric: 'No data yet' };
        return { status: 'Active', metric: totalViews > 0 ? `${totalViews.toLocaleString()} views` : `${posts.length} post${posts.length !== 1 ? 's' : ''} live` };
      }
      default:
        return { status: 'Idle', metric: 'No data yet' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {BOT_DEFS.map((bot, i) => {
        const Icon = iconMap[bot.icon];
        const loading = getLoading(bot.id);
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
                  {loading ? (
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
