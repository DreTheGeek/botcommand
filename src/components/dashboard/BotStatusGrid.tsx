import { motion } from 'framer-motion';
import {
  Shield, Crown, Briefcase, Search, Hammer,
  Home, Video, Code, TrendingUp, ShoppingBag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { bots } from '@/data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Crown, Briefcase, Search, Hammer,
  Home, Video, Code, TrendingUp, ShoppingBag,
};

const statusColor: Record<string, string> = {
  active: 'bg-nexus-success',
  attention: 'bg-nexus-warning',
  error: 'bg-nexus-urgent',
};

export function BotStatusGrid() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">The Avengers — 10 Bot Fleet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {bots.map((bot, i) => {
          const Icon = iconMap[bot.icon] || Shield;
          return (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card
                className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/80 backdrop-blur cursor-pointer h-full"
                onClick={() => navigate(bot.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">{bot.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`h-2 w-2 rounded-full ${statusColor[bot.status]}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{bot.status}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{bot.description}</p>
                  <p className="text-xs font-mono font-medium text-primary truncate">{bot.keyMetric}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
