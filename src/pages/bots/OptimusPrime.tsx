import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { systemStatuses, systemLogs } from '@/data/mockData';

// --- Bot Status Tab ---
function BotStatusTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Bot Fleet Status</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Bot Name</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Uptime</th>
              <th className="pb-2 font-medium">Last Activity</th>
              <th className="pb-2 font-medium text-right">Messages</th>
              <th className="pb-2 font-medium text-right">Avg Response</th>
            </tr></thead>
            <tbody>
              {systemStatuses.map((bot, i) => (
                <tr key={bot.botId || i} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{bot.botName}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={bot.status === 'offline' ? 'destructive' : 'outline'}
                      className={`text-xs ${bot.status === 'online' ? 'border-green-500 text-green-500' : bot.status === 'degraded' ? 'border-yellow-500 text-yellow-500' : ''}`}
                    >
                      {bot.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 font-mono">{bot.uptime}</td>
                  <td className="py-2.5 text-muted-foreground">{bot.lastActivity}</td>
                  <td className="py-2.5 text-right font-mono">{bot.messagesHandled.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-mono">{bot.avgResponseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- System Logs Tab ---
function SystemLogsTab() {
  const levelColor: Record<string, string> = {
    info: 'border-blue-500 text-blue-500',
    warn: 'border-yellow-500 text-yellow-500',
    error: 'border-red-500 text-red-500',
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">System Logs</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-muted-foreground text-left">
              <th className="pb-2 font-medium">Timestamp</th>
              <th className="pb-2 font-medium">Level</th>
              <th className="pb-2 font-medium">Source</th>
              <th className="pb-2 font-medium">Message</th>
            </tr></thead>
            <tbody>
              {systemLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={log.level === 'error' ? 'destructive' : 'outline'}
                      className={`text-xs ${levelColor[log.level] || ''}`}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-muted-foreground whitespace-nowrap">{log.source}</td>
                  <td className="py-2.5">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function OptimusPrime() {
  const tabs = [
    { value: 'status', label: 'Bot Status', content: <BotStatusTab /> },
    { value: 'logs', label: 'System Logs', content: <SystemLogsTab /> },
  ];

  return <BotPageLayout botId="optimus" tabs={tabs} defaultTab="status" />;
}
