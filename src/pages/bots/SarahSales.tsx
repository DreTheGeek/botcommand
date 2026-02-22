import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePipeline, useProposals, useDeals } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n),
  date: (d: string) => d ? new Date(d).toLocaleDateString() : '\u2014',
};

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

const stageColors: Record<string, string> = {
  lead: 'bg-muted text-muted-foreground',
  contacted: 'bg-blue-500/20 text-blue-400',
  meeting_set: 'bg-purple-500/20 text-purple-400',
  proposal_sent: 'bg-amber-500/20 text-amber-400',
  negotiation: 'bg-orange-500/20 text-orange-400',
  closed_won: 'bg-green-500/20 text-green-400',
  closed_lost: 'bg-red-500/20 text-red-400',
};

function PipelineTab() {
  const { data: pipeline } = usePipeline();
  const pipelineData = (pipeline || []) as any[];
  const totalValue = pipelineData.reduce((s, p) => s + (Number(p.deal_value) || 0), 0);
  const activeDeals = pipelineData.filter(p => !['closed_won', 'closed_lost'].includes(p.stage));

  const metrics = [
    { label: 'Pipeline Value', value: fmt.money(totalValue) },
    { label: 'Active Deals', value: activeDeals.length.toString() },
    { label: 'Total Tracked', value: pipelineData.length.toString() },
    { label: 'Avg Deal Size', value: pipelineData.length > 0 ? fmt.money(totalValue / pipelineData.length) : '$0' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {pipelineData.length === 0 ? <EmptyState message="No pipeline data yet" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prospect</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Probability</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Expected Close</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">{p.prospect_name || p.name || '\u2014'}</TableCell>
                    <TableCell>{p.company || '\u2014'}</TableCell>
                    <TableCell><Badge className={stageColors[p.stage] || ''}>{(p.stage || '').replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{p.deal_value ? fmt.money(Number(p.deal_value)) : '\u2014'}</TableCell>
                    <TableCell className="text-right">{p.probability ? `${p.probability}%` : '\u2014'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.last_activity || '\u2014'}</TableCell>
                    <TableCell>{fmt.date(p.expected_close_date || '')}</TableCell>
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
  const { data: proposals } = useProposals();
  const proposalData = (proposals || []) as any[];

  const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-purple-500/20 text-purple-400',
    accepted: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    expired: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {proposalData.length === 0 ? <EmptyState message="No proposals yet" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Prospect</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Valid Until</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposalData.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-bold">{p.title || '\u2014'}</TableCell>
                  <TableCell>{p.prospect_name || '\u2014'}</TableCell>
                  <TableCell className="text-right font-medium">{p.price ? fmt.money(Number(p.price)) : '\u2014'}</TableCell>
                  <TableCell><Badge className={statusColors[p.status] || ''}>{p.status || '\u2014'}</Badge></TableCell>
                  <TableCell>{fmt.date(p.sent_at || '')}</TableCell>
                  <TableCell>{fmt.date(p.valid_until || '')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function DealsTab() {
  const { data: deals } = useDeals();
  const dealData = (deals || []) as any[];
  const totalRevenue = dealData.reduce((s, d) => s + (Number(d.deal_value) || 0), 0);
  const activeDeals = dealData.filter(d => d.status === 'active');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-[hsl(var(--nexus-success))]">{fmt.money(totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{dealData.length}</p><p className="text-xs text-muted-foreground">Closed Deals</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{activeDeals.length}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{dealData.length > 0 ? fmt.money(totalRevenue / dealData.length) : '$0'}</p><p className="text-xs text-muted-foreground">Avg Deal Size</p></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {dealData.length === 0 ? <EmptyState message="No closed deals yet" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealData.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-bold">{d.client_name || '\u2014'}</TableCell>
                    <TableCell>{d.company || '\u2014'}</TableCell>
                    <TableCell className="text-right font-medium text-[hsl(var(--nexus-success))]">{d.deal_value ? fmt.money(Number(d.deal_value)) : '\u2014'}</TableCell>
                    <TableCell><Badge variant="outline">{(d.deal_type || '').replace(/_/g, ' ') || '\u2014'}</Badge></TableCell>
                    <TableCell><Badge variant={d.status === 'active' ? 'default' : 'secondary'}>{d.status || '\u2014'}</Badge></TableCell>
                    <TableCell>{fmt.date(d.start_date || '')}</TableCell>
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

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Sales Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Min Deal Size', value: '$25,000' },
            { label: 'Target Close Rate', value: '30%' },
            { label: 'Follow-up Cadence', value: '48h' },
            { label: 'Proposal Expiry', value: '14 days' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SarahSales() {
  return (
    <BotPageLayout botId="sarah" tabs={[
      { value: 'pipeline', label: 'Pipeline', content: <PipelineTab /> },
      { value: 'proposals', label: 'Proposals', content: <ProposalsTab /> },
      { value: 'deals', label: 'Closed Deals', content: <DealsTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
