import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifications, bots } from '@/data/mockData';

const priorityColors: Record<string, string> = {
  urgent: 'bg-nexus-urgent',
  action: 'bg-nexus-warning',
  win: 'bg-nexus-success',
  info: 'bg-nexus-info',
};

export function AlertCenter() {
  const [filter, setFilter] = useState('all');
  const filtered = notifications
    .filter((n) => filter === 'all' || n.priority === filter)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="bg-card/80 backdrop-blur h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Alert Center
          </CardTitle>
          <div className="flex gap-1 mt-2">
            {['all', 'urgent', 'action', 'win'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                className="text-xs h-6 capitalize"
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((n) => {
            const bot = bots.find((b) => b.id === n.botId);
            return (
              <div
                key={n.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <span
                  className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${priorityColors[n.priority]}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {bot?.name} · {n.timeAgo}
                  </p>
                </div>
              </div>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-primary"
          >
            View All Notifications
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
