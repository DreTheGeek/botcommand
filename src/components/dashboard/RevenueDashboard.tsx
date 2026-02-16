import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBotData, aggregateRevenue } from '@/hooks/useBotData';
import { useRevenueTracking } from '@/hooks/useExternalData';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

const sources = [
  { label: 'Property Deals', key: 'property' as const, color: 'text-nexus-info', route: '/bots/ronnie' },
  { label: 'Trading Profits', key: 'trading' as const, color: 'text-nexus-success', route: '/bots/trading' },
  { label: 'Sales/Consulting', key: 'sales' as const, color: 'text-accent', route: '/bots/ana' },
  { label: 'Dropshipping', key: 'dropshipping' as const, color: 'text-nexus-warning', route: '/bots/deondre' },
];

export function RevenueDashboard() {
  const navigate = useNavigate();
  const { data: entries } = useBotData({ categories: ['trade', 'revenue', 'property_deal', 'product'] });
  const { data: externalRevenue, isLoading } = useRevenueTracking();

  // Merge: prefer external data if available
  const extTotal = (externalRevenue || []).reduce((s: number, r: any) => s + (Number(r.amount) || Number(r.revenue) || 0), 0);
  const rev = aggregateRevenue(entries || []);
  const total = extTotal > 0 ? extTotal : rev.total;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" /> Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            {isLoading ? (
              <Skeleton className="h-10 w-40 mx-auto" />
            ) : (
              <p className="text-4xl font-bold font-mono text-nexus-success">{fmt(total)}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Aggregated from all sources</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sources.map((s) => (
              <div
                key={s.key}
                className="text-center p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => navigate(s.route)}
              >
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-lg font-mono font-bold ${s.color}`}>{fmt(rev[s.key])}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
