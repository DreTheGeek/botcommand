import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePipeline, useTrades, useBotActivityLog, usePropertyDeals, useProducts } from '@/hooks/useExternalData';

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function BotStatusGrid() {
  const navigate = useNavigate();
  const { data: pipeline, isLoading: loadingPipeline } = usePipeline();
  const { data: trades, isLoading: loadingTrades } = useTrades();
  const { data: activity, isLoading: loadingActivity } = useBotActivityLog(10);
  const { data: propertyDeals } = usePropertyDeals();
  const { data: products } = useProducts();

  const isLoading = loadingPipeline || loadingTrades || loadingActivity;

  // Aggregate metrics across all domains
  const pipelineValue = (pipeline || [])
    .filter((x: any) => ['proposal_sent', 'negotiation', 'meeting_set'].includes(x.stage))
    .reduce((s: number, x: any) => s + (Number(x.deal_value) || Number(x.deal_size) || 0), 0);

  const closedTrades = (trades || []).filter((t: any) => t.status === 'closed');
  const tradingPnl = closedTrades.reduce((s: number, t: any) => s + (Number(t.pnl) || 0), 0);

  const hotDeals = (propertyDeals || []).filter((x: any) => (Number(x.net_profit) || 0) >= 40000).length;
  const scalingProducts = (products || []).filter((p: any) => ['scaling', 'winner'].includes((p.status || '').toLowerCase())).length;

  const recentActions = (activity || []).length;

  const stats = [
    { label: 'Pipeline Value', value: pipelineValue > 0 ? fmt(pipelineValue) : 'No active deals' },
    { label: 'Trading P&L', value: closedTrades.length > 0 ? `${tradingPnl >= 0 ? '+' : ''}$${tradingPnl.toFixed(2)}` : 'No trades' },
    { label: 'Hot Property Deals', value: hotDeals > 0 ? `${hotDeals} deals` : 'Scanning...' },
    { label: 'Scaling Products', value: scalingProducts > 0 ? `${scalingProducts} products` : 'Testing...' },
    { label: 'Recent Actions', value: `${recentActions} logged` },
  ];

  return (
    <div className="space-y-6">
      {/* Ava Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/80 backdrop-blur cursor-pointer" onClick={() => navigate('/bots/ava')}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Crown className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ava - Chief of Staff</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-nexus-success" />
                    <span className="text-sm text-muted-foreground">Active - All Systems Online</span>
                  </div>
                </div>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 px-3 py-1" onClick={(e) => { e.stopPropagation(); navigate('/bots/ava'); }}>View Details &rarr;</button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Unified AI Chief of Staff handling intelligence, revenue, customer service, analytics, and database operations across all ventures.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-muted/50 rounded-lg p-3">
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 mb-1" />
                  ) : (
                    <p className="text-sm font-mono font-semibold text-primary truncate">{stat.value}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
