import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { properties, purchases, fmt } from '@/data/mockData';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, MapPin, DollarSign, CalendarDays, Target, Download } from 'lucide-react';

const statusColor: Record<string, string> = { 'Hot Deal': 'destructive', 'Warm': 'default', 'Watching': 'secondary', 'Passed': 'outline' };
const purchaseStatusColor: Record<string, string> = { Owned: 'default', Renovating: 'secondary', Listed: 'outline', Sold: 'destructive' };

const profitByCounty = properties.reduce((acc, p) => {
  const existing = acc.find((a) => a.county === p.county);
  if (existing) existing.profit += p.netProfit;
  else acc.push({ county: p.county, profit: p.netProfit });
  return acc;
}, [] as { county: string; profit: number }[]);

const dealsOverTime = [
  { month: 'Sep', deals: 8 }, { month: 'Oct', deals: 5 }, { month: 'Nov', deals: 12 },
  { month: 'Dec', deals: 7 }, { month: 'Jan', deals: 10 }, { month: 'Feb', deals: 14 },
];

function OverviewTab() {
  const hotDeals = properties.filter((p) => p.status === 'Hot Deal').length;
  const totalProfit = properties.reduce((s, p) => s + p.netProfit, 0);
  const upcomingSales = new Set(properties.map((p) => p.saleDate)).size;
  const metrics = [
    { label: 'Hot Deals', value: hotDeals, icon: Target, color: 'text-[hsl(var(--nexus-urgent))]' },
    { label: 'Total Profit Potential', value: fmt.money(totalProfit), icon: DollarSign, color: 'text-[hsl(var(--nexus-success))]' },
    { label: 'Upcoming Sales', value: upcomingSales, icon: CalendarDays, color: 'text-[hsl(var(--nexus-info))]' },
    { label: 'States Covered', value: new Set(properties.map((p) => p.state)).size, icon: MapPin, color: 'text-[hsl(var(--nexus-purple))]' },
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
      <Card>
        <CardHeader><CardTitle className="text-base">Active States</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...new Set(properties.map((p) => p.state))].map((s) => (
              <Badge key={s} variant="outline">{s} ({properties.filter((p) => p.state === s).length} deals)</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DealPipelineTab() {
  const [selected, setSelected] = useState<typeof properties[0] | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => {
          const csv = ['Address,County,State,Sale Date,Min Bid,ARV,Net Profit,Score,Status', ...properties.map((p) => `"${p.address}",${p.county},${p.state},${p.saleDate},${p.minBid},${p.arv},${p.netProfit},${p.dealScore},${p.status}`)].join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'deals.csv'; a.click();
        }}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead><TableHead>County</TableHead><TableHead>State</TableHead>
                <TableHead>Sale Date</TableHead><TableHead className="text-right">Min Bid</TableHead>
                <TableHead className="text-right">Net Profit</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p) => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelected(p)}>
                  <TableCell className="font-medium">{p.address}</TableCell>
                  <TableCell>{p.county}</TableCell><TableCell>{p.state}</TableCell>
                  <TableCell>{fmt.date(p.saleDate)}</TableCell>
                  <TableCell className="text-right">{fmt.money(p.minBid)}</TableCell>
                  <TableCell className={`text-right font-medium ${p.netProfit >= 50000 ? 'text-[hsl(var(--nexus-success))]' : ''}`}>{fmt.money(p.netProfit)}</TableCell>
                  <TableCell><Badge variant={p.dealScore >= 85 ? 'default' : 'secondary'}>{p.dealScore}</Badge></TableCell>
                  <TableCell><Badge variant={statusColor[p.status] as any}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.address}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">County:</span> {selected.county}, {selected.state}</div>
              <div><span className="text-muted-foreground">Sale Date:</span> {fmt.date(selected.saleDate)}</div>
              <div><span className="text-muted-foreground">Min Bid:</span> {fmt.money(selected.minBid)}</div>
              <div><span className="text-muted-foreground">ARV:</span> {fmt.money(selected.arv)}</div>
              <div><span className="text-muted-foreground">Est. Repairs:</span> {fmt.money(selected.repairs)}</div>
              <div><span className="text-muted-foreground">Net Profit:</span> <span className="font-bold text-[hsl(var(--nexus-success))]">{fmt.money(selected.netProfit)}</span></div>
              <div><span className="text-muted-foreground">Beds/Baths:</span> {selected.beds}bd / {selected.baths}ba</div>
              <div><span className="text-muted-foreground">Sqft:</span> {fmt.num(selected.sqft)}</div>
              <div><span className="text-muted-foreground">Deal Score:</span> {selected.dealScore}/100</div>
              <div><span className="text-muted-foreground">Status:</span> <Badge variant={statusColor[selected.status] as any}>{selected.status}</Badge></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CalendarTab() {
  const saleDates = properties.map((p) => new Date(p.saleDate));
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Tax Sale Calendar</CardTitle></CardHeader>
      <CardContent className="flex justify-center">
        <Calendar modifiers={{ sale: saleDates }} modifiersClassNames={{ sale: 'bg-primary text-primary-foreground' }} />
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Deals Over Time</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dealsOverTime}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip /><Line type="monotone" dataKey="deals" stroke="hsl(var(--primary))" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Profit by County</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={profitByCounty}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="county" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip formatter={(v: number) => fmt.money(v)} /><Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function PurchasesTab() {
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead><TableHead>Purchase Price</TableHead><TableHead>Repairs</TableHead>
              <TableHead>Sold Price</TableHead><TableHead>Profit</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.address}</TableCell>
                <TableCell>{fmt.money(p.purchasePrice)}</TableCell>
                <TableCell>{fmt.money(p.repairs)}</TableCell>
                <TableCell>{p.soldPrice ? fmt.money(p.soldPrice) : '—'}</TableCell>
                <TableCell className={p.actualProfit ? 'text-[hsl(var(--nexus-success))] font-medium' : ''}>{p.actualProfit ? fmt.money(p.actualProfit) : '—'}</TableCell>
                <TableCell><Badge variant={purchaseStatusColor[p.status] as any}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Deal Criteria</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Min Profit Threshold</span><span className="font-medium">$40,000</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Max Purchase Price</span><span className="font-medium">$50,000</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Property Types</span><span className="font-medium">SFH, Duplex</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Min Deal Score</span><span className="font-medium">60</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Bot Active</p><p className="text-xs text-muted-foreground">Ronnie is scanning for deals</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">States Monitored</span><span>31</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Counties Tracked</span><span>247</span></div>
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
