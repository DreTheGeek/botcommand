import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { products, campaigns, suppliers, fmt } from '@/data/mockData';
import type { Product } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';

const statusColor: Record<string, string> = { Testing: 'secondary', Scaling: 'default', Killed: 'outline' };

function ProductsTab() {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelected(p)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-sm">{p.name}</h3>
                <Badge variant={statusColor[p.status] as any}>{p.status}</Badge>
              </div>
              <div className={`text-2xl font-bold ${p.roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : p.roas >= 2 ? 'text-[hsl(var(--nexus-warning))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                {p.roas.toFixed(1)}x ROAS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Revenue: {fmt.money(p.revenueToday)}</div>
                <div>Orders: {p.ordersToday}</div>
                <div>Ad Spend: {fmt.money(p.adSpend)}</div>
                <div>CVR: {fmt.pct(p.conversionRate)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={statusColor[selected.status] as any}>{selected.status}</Badge></div>
                <div><span className="text-muted-foreground">ROAS:</span> <span className="font-bold">{selected.roas.toFixed(1)}x</span></div>
                <div><span className="text-muted-foreground">Revenue Today:</span> {fmt.money(selected.revenueToday)}</div>
                <div><span className="text-muted-foreground">Orders:</span> {selected.ordersToday}</div>
                <div><span className="text-muted-foreground">Ad Spend:</span> {fmt.money(selected.adSpend)}</div>
                <div><span className="text-muted-foreground">AOV:</span> {fmt.moneyDecimal(selected.aov)}</div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={[{ name: 'Revenue', value: selected.revenueToday }, { name: 'Ad Spend', value: selected.adSpend }, { name: 'Profit', value: selected.revenueToday - selected.adSpend }]}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip formatter={(v: number) => fmt.money(v)} /><Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PerformanceTab() {
  const activeProducts = products.filter((p) => p.status !== 'Killed');
  const totalRevenue = activeProducts.reduce((s, p) => s + p.revenueToday, 0);
  const totalSpend = activeProducts.reduce((s, p) => s + p.adSpend, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt.money(totalRevenue) },
          { label: 'Total Ad Spend', value: fmt.money(totalSpend) },
          { label: 'Net Profit', value: fmt.money(totalRevenue - totalSpend) },
          { label: 'Blended ROAS', value: `${(totalRevenue / Math.max(1, totalSpend)).toFixed(1)}x` },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">ROAS</TableHead><TableHead>Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {activeProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant={statusColor[p.status] as any}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right">{fmt.money(p.revenueToday)}</TableCell>
                  <TableCell className={`text-right font-medium ${p.roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-warning))]'}`}>{p.roas.toFixed(1)}x</TableCell>
                  <TableCell className="space-x-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Scale</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--nexus-urgent))]">Kill</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignsTab() {
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Product</TableHead><TableHead>Platform</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Spend</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">ROAS</TableHead><TableHead>CTR</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.product}</TableCell>
                <TableCell><Badge variant="outline">{c.platform}</Badge></TableCell>
                <TableCell className="text-right">{fmt.money(c.budget)}</TableCell>
                <TableCell className="text-right">{fmt.money(c.spend)}</TableCell>
                <TableCell className="text-right">{fmt.money(c.revenue)}</TableCell>
                <TableCell className="text-right font-medium">{c.roas.toFixed(1)}x</TableCell>
                <TableCell>{fmt.pct(c.ctr)}</TableCell>
                <TableCell><Badge variant={c.status === 'Active' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SuppliersTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {suppliers.map((s) => (
        <Card key={s.id}>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium">{s.name}</h3>
            <Badge variant="outline">{s.platform}</Badge>
            <div className="flex items-center gap-1 text-sm">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(s.rating) ? 'fill-[hsl(var(--nexus-warning))] text-[hsl(var(--nexus-warning))]' : 'text-muted-foreground'}`} />)}
              <span className="ml-1 text-xs">{s.rating}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Avg Ship: {s.avgShipTime}d</div>
              <div>Products: {s.productsSupplied}</div>
              <div className={s.issues > 0 ? 'text-[hsl(var(--nexus-urgent))]' : ''}>Issues: {s.issues}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">ROAS Thresholds</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Scale Threshold</span><span className="text-[hsl(var(--nexus-success))]">≥ 3.0x</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Watch Threshold</span><span className="text-[hsl(var(--nexus-warning))]">2.0x - 3.0x</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Kill Threshold</span><span className="text-[hsl(var(--nexus-urgent))]">&lt; 1.5x</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Deondre Active</p><p className="text-xs text-muted-foreground">Testing and scaling products</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DeondreDropshipping() {
  return (
    <BotPageLayout botId="deondre" tabs={[
      { value: 'products', label: 'Products', content: <ProductsTab /> },
      { value: 'performance', label: 'Performance', content: <PerformanceTab /> },
      { value: 'campaigns', label: 'Ad Campaigns', content: <CampaignsTab /> },
      { value: 'suppliers', label: 'Suppliers', content: <SuppliersTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
