import { motion } from 'framer-motion';
import {
  Home,
  Briefcase,
  TrendingUp,
  Search,
  ShoppingBag,
  Video,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bots } from '@/data/mockData';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Home,
  Briefcase,
  TrendingUp,
  Search,
  ShoppingBag,
  Video,
};

const statusColors: Record<string, string> = {
  active: 'bg-nexus-success',
  attention: 'bg-nexus-warning',
  error: 'bg-nexus-urgent',
};

export function BotStatusGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {bots.map((bot, i) => {
        const Icon = iconMap[bot.icon];
        return (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
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
                        <span
                          className={`h-2 w-2 rounded-full ${statusColors[bot.status]}`}
                        />
                        <span className="text-xs text-muted-foreground capitalize">
                          {bot.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {bot.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-primary">
                    {bot.keyMetric}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 text-primary hover:text-primary"
                    onClick={() => navigate(bot.route)}
                  >
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
