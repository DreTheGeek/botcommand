import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useBotData } from '@/hooks/useBotData';
import { useProducts } from '@/hooks/useExternalData';
import { products as mockProducts, campaigns, suppliers, fmt as mockFmt } from '@/data/mockData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function ProductsTab() {
  const { data: extProducts } = useProducts();
  const productData = (extProducts || []).length > 0 ? (extProducts as any[]) : mockProducts;

  const statusColor = (status: string) => {
    switch (status) {
      case 'Scaling': return 'bg-primary/10 text-primary border-primary/30';
      case 'Testing': return '';
      case 'Killed': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productData.map((p: any) => {
        const roas = Number(p.roas || 0);
        const roasColor = roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : roas >= 2 ? 'text-[hsl(var(--nexus-warning))]' : 'text-[hsl(var(--nexus-urgent))]';
        return (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{p.name || p.product || p.title || 'Product'}</CardTitle>
                <Badge variant="outline" className={statusColor(p.status || '')}>{p.status || 'New'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className={`text-3xl font-bold ${roasColor}`}>{roas.toFixed(1)}x <span className="text-xs text-muted-foreground font-normal">ROAS</span></p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium">{fmt.money(Number(p.revenueToday || p.revenue_today || p.revenue || 0))}</span></div>
                <div><span className="text-muted-foreground">Orders:</span> <span className="font-medium">{p.ordersToday || p.orders_today || p.orders || 0}</span></div>
                <div><span className="text-muted-foreground">Ad Spend:</span> <span className="font-medium">{fmt.money(Number(p.adSpend || p.ad_spend || 0))}</span></div>
                <div><span className="text-muted-foreground">CVR:</span> <span className="font-medium">{(p.conversionRate || p.conversion_rate || 0)}%</span></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PerformanceTab() {
  const productData = mockProducts;
  const totalRevenue = productData.reduce((s, p) => s + p.revenueToday, 0);
  const totalAdSpend = productData.reduce((s, p) => s + p.adSpend, 0);
  const netProfit = totalRevenue - totalAdSpend;
  const blendedRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(totalAdSpend)}</p><p className="text-xs text-muted-foreground">Total Ad Spend</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-[hsl(var(--nexus-success))]">{fmt.money(netProfit)}</p><p className="text-xs text-muted-foreground">Net Profit</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{blendedRoas.toFixed(1)}x</p><p className="text-xs text-muted-foreground">Blended ROAS</p></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.filter((p) => p.status !== 'Killed').map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                  <TableCell className="text-right">{fmt.money(p.revenueToday)}</TableCell>
                  <TableCell className={`text-right font-medium ${p.roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : p.roas >= 2 ? 'text-[hsl(var(--nexus-warning))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>{p.roas.toFixed(1)}x</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Scale</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Kill</Button>
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
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Spend</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.product}</TableCell>
                <TableCell><Badge variant="outline">{c.platform}</Badge></TableCell>
                <TableCell className="text-right">{fmt.money(c.budget)}</TableCell>
                <TableCell className="text-right">{fmt.money(c.spend)}</TableCell>
                <TableCell className="text-right">{fmt.money(c.revenue)}</TableCell>
                <TableCell className={`text-right font-medium ${c.roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-warning))]'}`}>{c.roas.toFixed(1)}x</TableCell>
                <TableCell className="text-right">{c.ctr}%</TableCell>
                <TableCell><Badge variant={c.status === 'Active' ? 'default' : 'outline'}>{c.status}</Badge></TableCell>
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
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Avg Ship (days)</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="text-right">Issues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell><Badge variant="outline">{s.platform}</Badge></TableCell>
                <TableCell className="text-right">{s.rating}/5</TableCell>
                <TableCell className="text-right">{s.avgShipTime}</TableCell>
                <TableCell className="text-right">{s.productsSupplied}</TableCell>
                <TableCell className="text-right">{s.issues}</TableCell>
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
        <CardHeader><CardTitle className="text-base">Scaling Criteria</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Min ROAS to Scale', value: '3.0x' },
            { label: 'Kill Threshold', value: '<1.5x after 3 days' },
            { label: 'Max Daily Ad Spend', value: '$2,000' },
            { label: 'Target AOV', value: '$30+' },
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
            <span className="text-sm text-muted-foreground">Auto-Scale Winners</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Auto-Kill Losers</span>
            <Switch />
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
