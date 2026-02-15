import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BotStatusGrid } from '@/components/dashboard/BotStatusGrid';
import { RevenueDashboard } from '@/components/dashboard/RevenueDashboard';
import { AlertCenter } from '@/components/dashboard/AlertCenter';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { TodaysFocus } from '@/components/dashboard/TodaysFocus';

const Index = () => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    const refresh = setInterval(() => setSecondsAgo(0), 60000);
    return () => {
      clearInterval(tick);
      clearInterval(refresh);
    };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Command Center</h1>
          <p className="text-sm text-muted-foreground">Welcome back, LaSean</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Updated {secondsAgo}s ago
        </span>
      </motion.div>

      <BotStatusGrid />
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueDashboard />
        </div>
        <AlertCenter />
      </div>

      <TodaysFocus />
    </div>
  );
};

export default Index;
