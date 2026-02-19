import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot, Activity, Database, Shield } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

const BOTS = [
  { name: 'Ana Sales Analyst', category: 'sales', emoji: '💼' },
  { name: 'Carter Content', category: 'content', emoji: '🎬' },
  { name: 'Deondre Dropshipping', category: 'ecommerce', emoji: '📦' },
  { name: 'Rhianna Research', category: 'research', emoji: '🔍' },
  { name: 'Ronnie Realty', category: 'realty', emoji: '🏠' },
  { name: 'Tammy Trader', category: 'trading', emoji: '📈' },
  { name: 'Cleah Coding', category: 'coding', emoji: '💻' },
  { name: 'Benny Business Maker', category: 'business', emoji: '💼' },
];

function OverviewTab() {
  const metrics = [
    { label: 'Total Bots', value: '9', icon: Bot, color: 'text-primary' },
    { label: 'Active', value: '9', icon: Activity, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Knowledge Entries', value: 'Live', icon: Database, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'System Health', value: '100%', icon: Shield, color: 'text-[hsl(var(--nexus-success))]' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-8 w-8 ${m.color}`} />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Fleet Status</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Model</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BOTS.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="font-medium">{b.emoji} {b.name}</TableCell>
                  <TableCell><Badge variant="outline">{b.category}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[hsl(var(--nexus-success))]" />
                      <span className="text-sm text-[hsl(var(--nexus-success))]">Online</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">MiniMax M2.5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KnowledgeBaseTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Shared Knowledge Base</CardTitle></CardHeader>
      <CardContent>
        <EmptyState message="Knowledge entries will appear here as bots interact with users" />
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Orchestration Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Knowledge Limit (per bot)', value: '5 entries' },
            { label: 'Optimus Knowledge Limit', value: '10 entries' },
            { label: 'AI Model', value: 'MiniMax M2.5' },
            { label: 'Platform', value: 'Railway' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Orchestrator Active</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Knowledge Sharing</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">System Reports</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OptimusPrime() {
  return (
    <BotPageLayout botId="optimus" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'knowledge', label: 'Knowledge Base', content: <KnowledgeBaseTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
