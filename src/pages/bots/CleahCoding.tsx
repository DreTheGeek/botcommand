import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Code2, GitBranch, Bug, Layers } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function OverviewTab() {
  const metrics = [
    { label: 'Code Reviews', value: '—', icon: Code2, color: 'text-primary' },
    { label: 'Bugs Fixed', value: '—', icon: Bug, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Repos Analyzed', value: '—', icon: GitBranch, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'Languages', value: '10+', icon: Layers, color: 'text-[hsl(var(--nexus-purple))]' },
  ];

  const capabilities = [
    { label: 'Code Review', desc: 'Analyzes code for bugs, security issues, and best practices' },
    { label: 'Debugging', desc: 'Identifies root causes and suggests targeted fixes' },
    { label: 'Architecture', desc: 'Designs scalable system architecture and patterns' },
    { label: 'Documentation', desc: 'Generates clear docs, READMEs, and inline comments' },
    { label: 'File Reading', desc: 'Reads uploaded code files, PDFs, and text documents' },
    { label: 'Image Analysis', desc: 'Analyzes screenshots, diagrams, and UI mockups' },
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
        <EmptyState message="Recent coding sessions will appear here" />
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
            { label: 'File Support', value: 'PDF, text, code' },
            { label: 'Image Support', value: 'JPEG, PNG, GIF' },
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

export default function CleahCoding() {
  return (
    <BotPageLayout botId="cleah" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'activity', label: 'Activity', content: <ActivityTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
