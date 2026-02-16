import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useDeals } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function PipelineTab() {
  const { data: extDeals } = useDeals();
  const deals = (extDeals || []) as any[];
  const pipelineValue = deals.reduce((s, p) => s + (Number(p.deal_size) || 0), 0);
  const activeDeals = deals.filter((d) => !['Won', 'Lost'].includes(d.stage)).length;
  const wonDeals = deals.filter((d) => d.stage === 'Won').length;
  const winRate = deals.length > 0 ? Math.round((wonDeals / deals.length) * 100) : 0;
  const avgDeal = deals.length > 0 ? Math.round(pipelineValue / deals.length) : 0;

  const stageColor = (stage: string) => {
    switch (stage) {
      case 'Won': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      case 'Lost': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'Negotiating': return 'bg-[hsl(var(--nexus-warning))]/10 text-[hsl(var(--nexus-warning))] border-[hsl(var(--nexus-warning))]/30';
      case 'Proposal': return 'bg-primary/10 text-primary border-primary/30';
      case 'Qualified': return 'bg-[hsl(var(--nexus-info))]/10 text-[hsl(var(--nexus-info))] border-[hsl(var(--nexus-info))]/30';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(pipelineValue)}</p><p className="text-xs text-muted-foreground">Total Pipeline</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{activeDeals}</p><p className="text-xs text-muted-foreground">Active Deals</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(avgDeal)}</p><p className="text-xs text-muted-foreground">Avg Deal Size</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-[hsl(var(--nexus-success))]">{winRate}%</p><p className="text-xs text-muted-foreground">Win Rate</p></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {deals.length === 0 ? <EmptyState message="No deals found yet" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Deal Size</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Days in Stage</TableHead>
                  <TableHead>Next Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.company || p.name || '—'}</TableCell>
                    <TableCell>{p.contact || '—'}</TableCell>
                    <TableCell className="text-right">{fmt.money(Number(p.deal_size || 0))}</TableCell>
                    <TableCell><Badge variant="outline" className={stageColor(p.stage)}>{p.stage || 'New'}</Badge></TableCell>
                    <TableCell className="text-right">{p.days_in_stage ?? '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{p.next_action || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProposalsTab() {
  // Proposals would come from an external table
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <EmptyState message="No proposals found yet" />
      </CardContent>
    </Card>
  );
}

function ActivityLogTab() {
  // Activity log would come from an external table
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <EmptyState message="No activity recorded yet" />
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  const { data: extDeals } = useDeals();
  const deals = (extDeals || []) as any[];
  const pipelineValue = deals.reduce((s, p) => s + (Number(p.deal_size) || 0), 0);
  const wonValue = deals.filter((p) => p.stage === 'Won').reduce((s: number, p: any) => s + (Number(p.deal_size) || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(pipelineValue)}</p><p className="text-xs text-muted-foreground">Total Pipeline</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold text-[hsl(var(--nexus-success))]">{fmt.money(wonValue)}</p><p className="text-xs text-muted-foreground">Won Revenue</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">Proposals Sent</p></CardContent></Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Sales Criteria</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Min Deal Size', value: '$25,000' },
            { label: 'Max Deal Size', value: '$85,000' },
            { label: 'Target Industries', value: 'Tech, Healthcare, Logistics' },
            { label: 'Follow-up Cadence', value: '3 days' },
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
            <span className="text-sm text-muted-foreground">Auto-Proposals</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lead Scoring</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnaSales() {
  return (
    <BotPageLayout botId="ana" tabs={[
      { value: 'pipeline', label: 'Pipeline', content: <PipelineTab /> },
      { value: 'proposals', label: 'Proposals', content: <ProposalsTab /> },
      { value: 'activity', label: 'Activity Log', content: <ActivityLogTab /> },
      { value: 'analytics', label: 'Analytics', content: <AnalyticsTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
