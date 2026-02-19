import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, TrendingUp, Target, Lightbulb } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function OverviewTab() {
  const metrics = [
    { label: 'Business Plans', value: '—', icon: Building2, color: 'text-primary' },
    { label: 'Revenue Strategies', value: '—', icon: TrendingUp, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Goals Set', value: '—', icon: Target, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'Ideas Generated', value: '—', icon: Lightbulb, color: 'text-[hsl(var(--nexus-purple))]' },
  ];

  const capabilities = [
    { label: 'Business Plans', desc: 'Creates full business plans with market analysis and financial projections' },
    { label: 'Revenue Strategies', desc: 'Identifies and optimizes revenue streams for your business model' },
    { label: 'Market Analysis', desc: 'Research competitors, trends, and opportunities in your niche' },
    { label: 'Scaling', desc: 'Strategies to scale operations from $0 to $10K/month and beyond' },
    { label: 'File Reading', desc: 'Analyzes business docs, PDFs, spreadsheets, and reports' },
    { label: 'Image Analysis', desc: 'Reviews charts, brand assets, and competitor screenshots' },
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
        <CardHeader><CardTitle className="text-base">Capabilities</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capabilities.map((c) => (
            <div key={c.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Badge variant="outline" className="shrink-0 mt-0.5">{c.label}</Badge>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
      <CardContent>
        <EmptyState message="Recent business sessions will appear here" />
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'AI Model', value: 'MiniMax M2.5' },
            { label: 'Max Tokens', value: '4,096' },
            { label: 'Specialization', value: 'Business Development' },
            { label: 'File Support', value: 'PDF, text, docs' },
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
            <span className="text-sm text-muted-foreground">Bot Active</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Knowledge Sharing</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">File Processing</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BennyBusinessMaker() {
  return (
    <BotPageLayout botId="benny" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'activity', label: 'Activity', content: <ActivityTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
