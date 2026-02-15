import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { prospects, proposals, activities, fmt } from '@/data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Phone, Mail, CalendarDays } from 'lucide-react';

const stageColors: Record<string, string> = { Lead: 'secondary', Qualified: 'default', Proposal: 'outline', Negotiating: 'destructive', Won: 'default', Lost: 'outline' };
const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiating', 'Won', 'Lost'] as const;
const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--nexus-success))', 'hsl(var(--nexus-warning))'];

function PipelineTab() {
  const [selected, setSelected] = useState<typeof prospects[0] | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const items = prospects.filter((p) => p.stage === stage);
          return (
            <Card key={stage}>
              <CardHeader className="p-3 pb-1"><CardTitle className="text-xs font-medium">{stage} ({items.length})</CardTitle></CardHeader>
              <CardContent className="p-3 pt-1 space-y-2">
                {items.map((p) => (
                  <div key={p.id} className="p-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted text-xs space-y-1" onClick={() => setSelected(p)}>
                    <p className="font-medium truncate">{p.company}</p>
                    <p className="text-muted-foreground">{fmt.money(p.dealSize)}</p>
                    <p className="text-muted-foreground">{p.daysInStage}d in stage</p>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Empty</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.company}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Contact:</span> {selected.contact}</div>
                <div><span className="text-muted-foreground">Deal Size:</span> {fmt.money(selected.dealSize)}</div>
                <div><span className="text-muted-foreground">Stage:</span> <Badge variant={stageColors[selected.stage] as any}>{selected.stage}</Badge></div>
                <div><span className="text-muted-foreground">Days in Stage:</span> {selected.daysInStage}</div>
              </div>
              <div><span className="text-muted-foreground">Next Action:</span> {selected.nextAction}</div>
              <div><span className="text-muted-foreground">Pain Points:</span> {selected.painPoints}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProposalsTab() {
  const statusColor: Record<string, string> = { Sent: 'secondary', Viewed: 'default', Accepted: 'destructive', Rejected: 'outline' };
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Company</TableHead><TableHead>Sent</TableHead><TableHead className="text-right">Deal Size</TableHead><TableHead>Views</TableHead><TableHead>Engagement</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.company}</TableCell>
                <TableCell>{fmt.date(p.sentDate)}</TableCell>
                <TableCell className="text-right">{fmt.money(p.dealSize)}</TableCell>
                <TableCell>{p.views}</TableCell>
                <TableCell><Badge variant={p.engagementScore >= 7 ? 'default' : 'secondary'}>{p.engagementScore}/10</Badge></TableCell>
                <TableCell><Badge variant={statusColor[p.status] as any}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ActivityTab() {
  const iconMap = { call: Phone, email: Mail, meeting: CalendarDays };
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {activities.map((a) => {
          const Icon = iconMap[a.type];
          return (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.prospect}</span>
                  <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{fmt.date(a.date)}</span>
                </div>
                <p className="text-muted-foreground">{a.subject}</p>
                <p className="text-xs mt-1">{a.outcome}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  const funnel = stages.slice(0, 5).map((s) => ({ stage: s, count: prospects.filter((p) => p.stage === s).length }));
  const dealSizes = [
    { name: '$0-$30K', value: prospects.filter((p) => p.dealSize < 30000).length },
    { name: '$30-$60K', value: prospects.filter((p) => p.dealSize >= 30000 && p.dealSize < 60000).length },
    { name: '$60K+', value: prospects.filter((p) => p.dealSize >= 60000).length },
  ];
  const pipelineValue = prospects.filter((p) => !['Won', 'Lost'].includes(p.stage)).reduce((s, p) => s + p.dealSize, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Value', value: fmt.money(pipelineValue) },
          { label: 'Won This Month', value: fmt.money(prospects.filter((p) => p.stage === 'Won').reduce((s, p) => s + p.dealSize, 0)) },
          { label: 'Avg Deal Size', value: fmt.money(Math.round(prospects.reduce((s, p) => s + p.dealSize, 0) / prospects.length)) },
          { label: 'Win Rate', value: fmt.pct((prospects.filter((p) => p.stage === 'Won').length / Math.max(1, prospects.filter((p) => ['Won', 'Lost'].includes(p.stage)).length)) * 100) },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Sales Funnel</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={funnel} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" stroke="hsl(var(--muted-foreground))" /><YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" width={90} fontSize={12} /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Deal Size Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={dealSizes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{dealSizes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div><p className="font-medium">Ana Active</p><p className="text-xs text-muted-foreground">Scanning for prospects and managing pipeline</p></div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Active Prospects</span><span>{prospects.filter((p) => !['Won', 'Lost'].includes(p.stage)).length}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Proposals Sent (this month)</span><span>{proposals.length}</span></div>
      </CardContent>
    </Card>
  );
}

export default function AnaSales() {
  return (
    <BotPageLayout botId="ana" tabs={[
      { value: 'pipeline', label: 'Pipeline', content: <PipelineTab /> },
      { value: 'proposals', label: 'Proposals', content: <ProposalsTab /> },
      { value: 'activity', label: 'Activity', content: <ActivityTab /> },
      { value: 'analytics', label: 'Analytics', content: <AnalyticsTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
