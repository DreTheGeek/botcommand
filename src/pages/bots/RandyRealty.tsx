import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { usePropertyDeals } from '@/hooks/useExternalData';
import { Target, DollarSign, CalendarDays, MapPin } from 'lucide-react';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  date: (d: string) => d ? new Date(d).toLocaleDateString() : '—',
};

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function OverviewTab() {
  const { data: extDeals } = usePropertyDeals();
  const deals = (extDeals || []) as any[];

  const hotDeals = deals.filter((d) => {
    const s = (d.status || '').toLowerCase();
    return s === 'hot deal' || s === 'hot' || s === 'watching';
  }).length;
  const totalProfit = deals.reduce((s, d) => s + (Number(d.net_profit) || 0), 0);
  const states = new Set(deals.map((d) => d.state).filter(Boolean));

  const metrics = [
    { label: 'Hot Deals', value: hotDeals, icon: Target, color: 'text-[hsl(var(--nexus-urgent))]' },
    { label: 'Total Profit Potential', value: fmt.money(totalProfit), icon: DollarSign, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Upcoming Sales', value: deals.length, icon: CalendarDays, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'States Covered', value: states.size, icon: MapPin, color: 'text-[hsl(var(--nexus-purple))]' },
  ];

  const stateCounts: Record<string, number> = {};
  deals.forEach((d) => { if (d.state) stateCounts[d.state] = (stateCounts[d.state] || 0) + 1; });

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
        <CardHeader><CardTitle className="text-base">Active States</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.keys(stateCounts).length === 0 && <EmptyState message="No state data yet" />}
          {Object.entries(stateCounts).map(([state, count]) => (
            <Badge key={state} variant="outline" className="text-sm">{state} ({count} deal{count > 1 ? 's' : ''})</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DealPipelineTab() {
  const { data: extDeals } = usePropertyDeals();
  const deals = (extDeals || []) as any[];

  const statusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'hot deal': case 'hot': case 'watching': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      case 'warm': case 'upcoming': return 'bg-primary/10 text-primary border-primary/30';
      case 'won': case 'bidding': return 'bg-[hsl(var(--nexus-warning))]/10 text-[hsl(var(--nexus-warning))] border-[hsl(var(--nexus-warning))]/30';
      default: return '';
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return 'bg-[hsl(var(--nexus-success))]';
    if (score >= 75) return 'bg-primary';
    if (score >= 60) return 'bg-[hsl(var(--nexus-warning))]';
    return 'bg-muted-foreground';
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {deals.length === 0 ? <EmptyState message="No deals found yet" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>County</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead className="text-right">Min Bid</TableHead>
                <TableHead className="text-right">Net Profit</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.address || d.property_address || '—'}</TableCell>
                  <TableCell>{d.county}</TableCell>
                  <TableCell>{d.state}</TableCell>
                  <TableCell>{fmt.date(d.sale_date || d.auction_date || '')}</TableCell>
                  <TableCell className="text-right">{fmt.money(Number(d.min_bid || d.opening_bid || 0))}</TableCell>
                  <TableCell className="text-right text-[hsl(var(--nexus-success))]">{fmt.money(Number(d.net_profit || 0))}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${scoreColor(d.deal_score || 0)}`}>
                      {d.deal_score || '—'}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={statusColor(d.status)}>{d.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function CalendarTab() {
  const { data: extDeals } = usePropertyDeals();
  const deals = ((extDeals || []) as any[]).filter((p) => p.sale_date || p.auction_date);

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Upcoming Tax Sale Dates</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {deals.length === 0 && <EmptyState message="No upcoming sales found" />}
        {deals.sort((a, b) => (a.sale_date || a.auction_date || '').localeCompare(b.sale_date || b.auction_date || '')).map((d) => (
          <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="font-medium text-sm">{d.address || d.property_address}</p>
              <p className="text-xs text-muted-foreground">{d.county}, {d.state}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{fmt.date(d.sale_date || d.auction_date)}</p>
              <Badge variant="outline" className="text-[10px]">{d.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  const { data: extDeals } = usePropertyDeals();
  const deals = (extDeals || []) as any[];
  const totalProfit = deals.reduce((s, d) => s + (Number(d.net_profit) || 0), 0);
  const avgScore = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + (Number(d.deal_score) || 0), 0) / deals.length) : 0;
  const avgProfit = deals.length > 0 ? Math.round(totalProfit / deals.length) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-[hsl(var(--nexus-success))]">{fmt.money(totalProfit)}</p><p className="text-xs text-muted-foreground">Total Profit Potential</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{avgScore}</p><p className="text-xs text-muted-foreground">Avg Deal Score</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(avgProfit)}</p><p className="text-xs text-muted-foreground">Avg Profit / Deal</p></CardContent></Card>
      </div>
    </div>
  );
}

function PurchasesTab() {
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <EmptyState message="No purchases recorded yet" />
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Deal Criteria</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Min Profit Threshold', value: '$40,000' },
            { label: 'Max Purchase Price', value: '$50,000' },
            { label: 'Property Types', value: 'SFH, Duplex' },
            { label: 'Min Deal Score', value: '60' },
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
            <span className="text-sm text-muted-foreground">States Monitored</span>
            <span className="text-sm font-medium">31</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Counties Tracked</span>
            <span className="text-sm font-medium">247</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RandyRealty() {
  return (
    <BotPageLayout botId="randy" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'pipeline', label: 'Deal Pipeline', content: <DealPipelineTab /> },
      { value: 'calendar', label: 'Calendar', content: <CalendarTab /> },
      { value: 'analytics', label: 'Analytics', content: <AnalyticsTab /> },
      { value: 'purchases', label: 'My Purchases', content: <PurchasesTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
