import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBotData } from '@/hooks/useBotData';
import { usePropertyDeals } from '@/hooks/useExternalData';
import { Target, DollarSign, CalendarDays, MapPin } from 'lucide-react';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function OverviewTab() {
  const { data: entries } = useBotData({ botId: 'ronnie', category: 'property_deal' });
  const { data: extDeals } = usePropertyDeals();
  const internalDeals = (entries || []).map((e) => e.data as Record<string, any>);
  const deals = (extDeals || []).length > 0 ? (extDeals as Record<string, any>[]) : internalDeals;
  const hotDeals = deals.filter((d) => d.status === 'Hot Deal' || d.status === 'hot').length;
  const totalProfit = deals.reduce((s, d) => s + (Number(d.profit) || Number(d.netProfit) || Number(d.net_profit) || 0), 0);

  const metrics = [
    { label: 'Hot Deals', value: hotDeals || deals.length, icon: Target, color: 'text-[hsl(var(--nexus-urgent))]' },
    { label: 'Total Profit Potential', value: fmt.money(totalProfit), icon: DollarSign, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Total Entries', value: deals.length, icon: CalendarDays, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'Unique States', value: new Set(deals.map((d) => d.state).filter(Boolean)).size || 0, icon: MapPin, color: 'text-[hsl(var(--nexus-purple))]' },
  ];

  return (
    <div className="space-y-4">
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
      {deals.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No property deals yet. Send Ronnie some data!</p>}
    </div>
  );
}

function DealsTab() {
  const { data: entries } = useBotData({ botId: 'ronnie', category: 'property_deal' });
  const { data: extDeals } = usePropertyDeals();
  const internalDeals = (entries || []).map((e) => ({ id: e.id, ...(e.data as Record<string, any>) }));
  const deals = (extDeals || []).length > 0 ? (extDeals as any[]) : internalDeals;

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead><TableHead>State</TableHead>
              <TableHead className="text-right">Min Bid</TableHead>
              <TableHead className="text-right">Profit</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No deals yet</TableCell></TableRow>
            )}
            {deals.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.address || '—'}</TableCell>
                <TableCell>{d.state || '—'}</TableCell>
                <TableCell className="text-right">{d.min_bid ? fmt.money(d.min_bid) : '—'}</TableCell>
                <TableCell className="text-right text-[hsl(var(--nexus-success))]">{d.profit || d.netProfit || d.net_profit ? fmt.money(Number(d.profit || d.netProfit || d.net_profit)) : '—'}</TableCell>
                <TableCell><Badge variant="outline">{d.status || 'New'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AllDataTab() {
  const { data: entries } = useBotData({ botId: 'ronnie' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Ronnie Data</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {(entries || []).length === 0 && <p className="text-sm text-muted-foreground">No data entries yet.</p>}
        {(entries || []).map((e) => (
          <div key={e.id} className="p-3 rounded-lg bg-muted/30 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">{e.category}</Badge>
              <span className="text-[10px] text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
            </div>
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{JSON.stringify(e.data, null, 2)}</pre>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function RonnieRealty() {
  return (
    <BotPageLayout botId="ronnie" tabs={[
      { value: 'overview', label: 'Overview', content: <OverviewTab /> },
      { value: 'deals', label: 'Deals', content: <DealsTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
