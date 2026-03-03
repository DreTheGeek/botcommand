import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products, campaigns, suppliers, fmt } from '@/data/mockData';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg font-mono font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

function ProductsTab() {
  const scaling = products.filter((p) => p.status === 'Scaling');
  const totalRevenueToday = products.reduce((s, p) => s + p.revenueToday, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={`${products.length}`} />
        <StatCard label="Scaling" value={`${scaling.length}`} />
        <StatCard label="Revenue Today" value={fmt.money(totalRevenueToday)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Products</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">ROAS</th>
                  <th className="pb-2 font-medium text-right">Revenue Today</th>
                  <th className="pb-2 font-medium text-right">Orders Today</th>
                  <th className="pb-2 font-medium text-right">Ad Spend</th>
                  <th className="pb-2 font-medium text-right">AOV</th>
                  <th className="pb-2 font-medium text-right">Conv Rate</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={p.status === 'Killed' ? 'destructive' : 'outline'}
                        className={`text-xs ${
                          p.status === 'Scaling'
                            ? 'border-green-500 text-green-500'
                            : p.status === 'Testing'
                            ? 'border-yellow-500 text-yellow-500'
                            : ''
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className={`py-2.5 text-right font-mono ${p.roas >= 3 ? 'text-green-500' : p.roas < 1.5 ? 'text-red-500' : ''}`}>
                      {p.roas.toFixed(1)}x
                    </td>
                    <td className="py-2.5 text-right font-mono">{fmt.money(p.revenueToday)}</td>
                    <td className="py-2.5 text-right font-mono">{p.ordersToday}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.money(p.adSpend)}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(p.aov)}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.pct(p.conversionRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignsTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Campaigns</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Platform</th>
                <th className="pb-2 font-medium text-right">Budget</th>
                <th className="pb-2 font-medium text-right">Spend</th>
                <th className="pb-2 font-medium text-right">Revenue</th>
                <th className="pb-2 font-medium text-right">ROAS</th>
                <th className="pb-2 font-medium text-right">CTR</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{c.product}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{c.platform}</Badge>
                  </td>
                  <td className="py-2.5 text-right font-mono">{fmt.money(c.budget)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.money(c.spend)}</td>
                  <td className="py-2.5 text-right font-mono text-green-500">{fmt.money(c.revenue)}</td>
                  <td className={`py-2.5 text-right font-mono ${c.roas >= 3 ? 'text-green-500' : c.roas < 1.5 ? 'text-red-500' : ''}`}>
                    {c.roas.toFixed(1)}x
                  </td>
                  <td className="py-2.5 text-right font-mono">{fmt.pct(c.ctr)}</td>
                  <td className="py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        c.status === 'Active'
                          ? 'border-green-500 text-green-500'
                          : 'border-yellow-500 text-yellow-500'
                      }`}
                    >
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SuppliersTab() {
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    const stars: string[] = [];
    for (let i = 0; i < full; i++) stars.push('\u2605');
    if (hasHalf) stars.push('\u00BD');
    return stars.join('') + ` (${rating.toFixed(1)})`;
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Suppliers</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Platform</th>
                <th className="pb-2 font-medium">Rating</th>
                <th className="pb-2 font-medium text-right">Avg Ship Time</th>
                <th className="pb-2 font-medium text-right">Products Supplied</th>
                <th className="pb-2 font-medium text-right">Issues</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{s.name}</td>
                  <td className="py-2.5 text-muted-foreground">{s.platform}</td>
                  <td className="py-2.5 font-mono text-yellow-500">{renderStars(s.rating)}</td>
                  <td className="py-2.5 text-right font-mono">{s.avgShipTime} days</td>
                  <td className="py-2.5 text-right font-mono">{s.productsSupplied}</td>
                  <td className={`py-2.5 text-right font-mono ${s.issues > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {s.issues}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DeondreDropshipping() {
  const tabs = [
    { value: 'products', label: 'Products', content: <ProductsTab /> },
    { value: 'campaigns', label: 'Campaigns', content: <CampaignsTab /> },
    { value: 'suppliers', label: 'Suppliers', content: <SuppliersTab /> },
  ];

  return <BotPageLayout botId="deondre" tabs={tabs} defaultTab="products" />;
}
