import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function getRevenue(p: any): number { return Number(p.total_revenue) || Number(p.revenue) || 0; }
function getOrders(p: any): number { return Number(p.total_orders) || Number(p.orders) || 0; }
function getAdSpend(p: any): number { return Number(p.daily_ad_spend) || Number(p.ad_spend) || 0; }
function getRoas(p: any): number { return Number(p.roas) || Number(p.avg_roas) || 0; }

function ProductsTab() {
  const { data: extProducts } = useProducts();
  const productData = (extProducts || []) as any[];

  const statusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'scaling': case 'winner': return 'bg-primary/10 text-primary border-primary/30';
      case 'testing': return '';
      case 'dead': case 'killed': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productData.length === 0 && <EmptyState message="No products found yet" />}
      {productData.map((p: any) => {
        const roas = getRoas(p);
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
                <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium">{fmt.money(getRevenue(p))}</span></div>
                <div><span className="text-muted-foreground">Orders:</span> <span className="font-medium">{getOrders(p)}</span></div>
                <div><span className="text-muted-foreground">Ad Spend:</span> <span className="font-medium">{fmt.money(getAdSpend(p))}</span></div>
                <div><span className="text-muted-foreground">CVR:</span> <span className="font-medium">{(p.conversion_rate || 0)}%</span></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PerformanceTab() {
  const { data: extProducts } = useProducts();
  const productData = (extProducts || []) as any[];
  const totalRevenue = productData.reduce((s, p: any) => s + getRevenue(p), 0);
  const totalAdSpend = productData.reduce((s, p: any) => s + getAdSpend(p), 0);
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
          {productData.length === 0 ? <EmptyState message="No products found yet" /> : (
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
                {productData.filter((p: any) => !['dead', 'killed'].includes((p.status || '').toLowerCase())).map((p: any) => {
                  const roas = getRoas(p);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name || p.product || 'Product'}</TableCell>
                      <TableCell><Badge variant="outline">{p.status || 'New'}</Badge></TableCell>
                      <TableCell className="text-right">{fmt.money(getRevenue(p))}</TableCell>
                      <TableCell className={`text-right font-medium ${roas >= 3 ? 'text-[hsl(var(--nexus-success))]' : roas >= 2 ? 'text-[hsl(var(--nexus-warning))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>{roas.toFixed(1)}x</TableCell>
                      <TableCell className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Scale</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Kill</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignsTab() {
  return (<Card><CardContent className="p-0 overflow-x-auto"><EmptyState message="No ad campaigns found yet" /></CardContent></Card>);
}

function SuppliersTab() {
  return (<Card><CardContent className="p-0 overflow-x-auto"><EmptyState message="No suppliers found yet" /></CardContent></Card>);
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
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Bot Active</span><Switch defaultChecked /></div>
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Auto-Scale Winners</span><Switch defaultChecked /></div>
          <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Auto-Kill Losers</span><Switch /></div>
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
