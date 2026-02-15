import { motion } from 'framer-motion';
import { ArrowUpRight, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { revenue } from '@/data/mockData';

const fmt = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

const sources = [
  { label: 'Property Deals', key: 'property' as const, color: 'text-nexus-info' },
  { label: 'Trading Profits', key: 'trading' as const, color: 'text-nexus-success' },
  { label: 'Sales/Consulting', key: 'sales' as const, color: 'text-accent' },
  { label: 'Dropshipping', key: 'dropshipping' as const, color: 'text-nexus-warning' },
];

export function RevenueDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" /> Today's Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-4xl font-bold font-mono text-nexus-success">
              {fmt(revenue.today.total)}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-nexus-success" />
              <span className="text-sm text-nexus-success font-medium">
                +{revenue.monthChange}% vs last month
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {sources.map((s) => (
              <div
                key={s.key}
                className="text-center p-3 rounded-lg bg-secondary/50"
              >
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-lg font-mono font-bold ${s.color}`}>
                  {fmt(revenue.today[s.key])}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">Active Pipeline</p>
            <p className="text-xl font-mono font-bold text-primary">
              {fmt(revenue.pipeline)}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
