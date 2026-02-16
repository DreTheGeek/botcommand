import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useBotData } from '@/hooks/useBotData';
import { usePropertyDeals } from '@/hooks/useExternalData';
import { Target, DollarSign, CalendarDays, MapPin } from 'lucide-react';
import { properties, purchases, fmt as mockFmt } from '@/data/mockData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function OverviewTab() {
  const { data: entries } = useBotData({ botId: 'ronnie', category: 'property_deal' });
  const { data: extDeals } = usePropertyDeals();
  const internalDeals = (extDeals || []).length > 0 ? (extDeals as Record<string, any>[]) : properties;
  const deals = (entries || []).length > 0 && internalDeals.length === 0
    ? (entries || []).map((e) => e.data as Record<string, any>)
    : internalDeals;

  const hotDeals = (deals as any[]).filter((d: any) => d.status === 'Hot Deal' || d.status === 'hot').length;
  const totalProfit = (deals as any[]).reduce((s: number, d: any) => s + (Number(d.netProfit) || Number(d.net_profit) || Number(d.profit) || 0), 0);
  const states = new Set((deals as any[]).map((d: any) => d.state).filter(Boolean));

  const metrics = [
    { label: 'Hot Deals', value: hotDeals, icon: Target, color: 'text-[hsl(var(--nexus-urgent))]' },
    { label: 'Total Profit Potential', value: fmt.money(totalProfit), icon: DollarSign, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Upcoming Sales', value: deals.length, icon: CalendarDays, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'States Covered', value: states.size, icon: MapPin, color: 'text-[hsl(var(--nexus-purple))]' },
  ];

  const stateCounts: Record<string, number> = {};
  (deals as any[]).forEach((d: any) => { if (d.state) stateCounts[d.state] = (stateCounts[d.state] || 0) + 1; });

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
  const deals = (extDeals || []).length > 0 ? (extDeals as any[]) : properties;

  const statusColor = (status: string) => {
    switch (status) {
      case 'Hot Deal': return 'bg-[hsl(var(--nexus-success))]/10 text-[hsl(var(--nexus-success))] border-[hsl(var(--nexus-success))]/30';
      case 'Warm': return 'bg-primary/10 text-primary border-primary/30';
      case 'Watching': return '';
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
                <TableCell className="font-medium">{d.address}</TableCell>
                <TableCell>{d.county}</TableCell>
                <TableCell>{d.state}</TableCell>
                <TableCell>{mockFmt.date(d.saleDate || d.sale_date || '')}</TableCell>
                <TableCell className="text-right">{fmt.money(Number(d.minBid || d.min_bid || 0))}</TableCell>
                <TableCell className="text-right text-[hsl(var(--nexus-success))]">{fmt.money(Number(d.netProfit || d.net_profit || d.profit || 0))}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${scoreColor(d.dealScore || d.deal_score || 0)}`}>
                    {d.dealScore || d.deal_score || '—'}
                  </span>
                </TableCell>
                <TableCell><Badge variant="outline" className={statusColor(d.status)}>{d.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CalendarTab() {
  const deals = properties.filter((p) => p.saleDate);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Upcoming Tax Sale Dates</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {deals.sort((a, b) => a.saleDate.localeCompare(b.saleDate)).map((d) => (
          <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="font-medium text-sm">{d.address}</p>
              <p className="text-xs text-muted-foreground">{d.county}, {d.state}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{mockFmt.date(d.saleDate)}</p>
              <Badge variant="outline" className="text-[10px]">{d.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  const deals = properties;
  const totalProfit = deals.reduce((s, d) => s + d.netProfit, 0);
  const avgScore = Math.round(deals.reduce((s, d) => s + d.dealScore, 0) / deals.length);
  const avgProfit = Math.round(totalProfit / deals.length);

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
  const statusColor = (status: string) => {
    switch (status) {
      case 'Sold': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'Renovating': return '';
      case 'Owned': return 'bg-primary/10 text-primary border-primary/30';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Repairs</TableHead>
              <TableHead className="text-right">Sold Price</TableHead>
              <TableHead className="text-right">Profit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.address}</TableCell>
                <TableCell className="text-right">{fmt.money(p.purchasePrice)}</TableCell>
                <TableCell className="text-right">{fmt.money(p.repairs)}</TableCell>
                <TableCell className="text-right">{p.soldPrice ? fmt.money(p.soldPrice) : '—'}</TableCell>
                <TableCell className="text-right text-[hsl(var(--nexus-success))]">{p.actualProfit ? fmt.money(p.actualProfit) : '—'}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor(p.status)}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default function RonnieRealty() {
  return (
    <BotPageLayout botId="ronnie" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'pipeline', label: 'Deal Pipeline', content: <DealPipelineTab /> },
      { value: 'calendar', label: 'Calendar', content: <CalendarTab /> },
      { value: 'analytics', label: 'Analytics', content: <AnalyticsTab /> },
      { value: 'purchases', label: 'My Purchases', content: <PurchasesTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
