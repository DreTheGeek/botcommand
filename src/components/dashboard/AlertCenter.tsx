import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBotData } from '@/hooks/useBotData';
import { useSystemNotifications } from '@/hooks/useExternalData';

const priorityColors: Record<string, string> = {
  urgent: 'bg-nexus-urgent',
  action: 'bg-nexus-warning',
  win: 'bg-nexus-success',
  info: 'bg-nexus-info',
};

const BOT_NAMES: Record<string, string> = {
  ronnie: 'Ronnie Realty',
  ana: 'Ana Sales',
  tammy: 'Tammy Trader',
  rhianna: 'Rhianna Research',
  deondre: 'Deondre Dropshipping',
  carter: 'Carter Content',
  trading: 'Tammy Trader',
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AlertCenter() {
  const [filter, setFilter] = useState('all');
  const { data: entries } = useBotData({ category: 'alert', limit: 20 });
  const { data: externalNotifications } = useSystemNotifications(20);

  // Merge internal alerts with external notifications
  const internalAlerts = (entries || []).map((e) => ({
    id: e.id,
    priority: (e.data as any)?.severity || 'info',
    botId: e.bot_id,
    message: (e.data as any)?.message || JSON.stringify(e.data),
    timeAgo: formatTimeAgo(e.created_at),
    source: 'internal' as const,
  }));

  const externalAlerts = (externalNotifications || []).map((n: any) => ({
    id: n.id,
    priority: n.priority || n.severity || 'info',
    botId: n.bot_id || 'system',
    message: n.message || n.content || '',
    timeAgo: formatTimeAgo(n.created_at),
    source: 'external' as const,
  }));

  const allAlerts = [...externalAlerts, ...internalAlerts];
  const filtered = allAlerts.filter((n) => filter === 'all' || n.priority === filter).slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
      <Card className="bg-card/80 backdrop-blur h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Alert Center
          </CardTitle>
          <div className="flex gap-1 mt-2">
            {['all', 'urgent', 'action', 'win'].map((f) => (
              <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" className="text-xs h-6 capitalize" onClick={() => setFilter(f)}>{f}</Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No alerts yet.</p>
          )}
          {filtered.map((n) => (
            <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${priorityColors[n.priority] || 'bg-nexus-info'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{BOT_NAMES[n.botId] || n.botId} · {n.timeAgo}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
