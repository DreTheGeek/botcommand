import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { quickStats } from '@/data/mockData';

const stats = [
  { label: 'Active Deals', value: quickStats.activeDeals, icon: Target, color: 'text-nexus-info' },
  { label: 'Open Positions', value: quickStats.openPositions, icon: TrendingUp, color: 'text-nexus-success' },
  { label: 'Content Scheduled', value: quickStats.contentScheduled, icon: Calendar, color: 'text-accent' },
  { label: 'System Health', value: 'Operational', icon: Shield, color: 'text-nexus-success', isHealth: true },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.05 }}
        >
          <Card className="bg-card/80 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold font-mono ${s.color}`}>
                  {s.isHealth ? '✓ OK' : s.value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
