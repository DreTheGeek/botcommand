import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useBotData } from '@/hooks/useBotData';

export function QuickStats() {
  const { data: entries } = useBotData({ limit: 200 });

  const all = entries || [];
  const activeDeals = all.filter((e) => e.category === 'property_deal').length;
  const openPositions = all.filter((e) => e.category === 'trade').length;
  const contentScheduled = all.filter((e) => e.category === 'content_stat').length;

  const stats = [
    { label: 'Property Deals', value: activeDeals, icon: Target, color: 'text-nexus-info' },
    { label: 'Trade Entries', value: openPositions, icon: TrendingUp, color: 'text-nexus-success' },
    { label: 'Content Updates', value: contentScheduled, icon: Calendar, color: 'text-accent' },
    { label: 'System Health', value: 'Live', icon: Shield, color: 'text-nexus-success', isHealth: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.05 }}>
          <Card className="bg-card/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold font-mono ${s.color}`}>{s.isHealth ? '✓ OK' : s.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
