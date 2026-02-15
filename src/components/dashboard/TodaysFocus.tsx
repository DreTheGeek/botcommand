import { useState } from 'react';
import { motion } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { tasks, bots } from '@/data/mockData';

const priorityDots: Record<string, string> = {
  urgent: 'bg-nexus-urgent',
  action: 'bg-nexus-warning',
  win: 'bg-nexus-success',
  info: 'bg-nexus-info',
};

export function TodaysFocus() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" /> Today's Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((t) => {
            const bot = bots.find((b) => b.id === t.botId);
            const done = completed.has(t.id);
            return (
              <div
                key={t.id}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors ${
                  done ? 'opacity-50' : ''
                }`}
              >
                <Checkbox
                  checked={done}
                  onCheckedChange={() => toggle(t.id)}
                />
                <span className={`text-sm flex-1 ${done ? 'line-through' : ''}`}>
                  {t.description}
                </span>
                <span className="text-xs text-muted-foreground">
                  {bot?.name}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${priorityDots[t.priority]}`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
