import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { properties, purchases, fmt } from '@/data/mockData';

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

function PropertyDealsTab() {
  const hotDeals = properties.filter((p) => p.status === 'Hot Deal');
  const totalProfit = properties.reduce((s, p) => s + p.netProfit, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Properties" value={`${properties.length}`} />
        <StatCard label="Hot Deals" value={`${hotDeals.length}`} />
        <StatCard label="Total Profit Potential" value={fmt.money(totalProfit)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Property Deals</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Address</th>
                  <th className="pb-2 font-medium">County/State</th>
                  <th className="pb-2 font-medium">Sale Date</th>
                  <th className="pb-2 font-medium text-right">Min Bid</th>
                  <th className="pb-2 font-medium text-right">ARV</th>
                  <th className="pb-2 font-medium text-right">Net Profit</th>
                  <th className="pb-2 font-medium text-right">Deal Score</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5">{p.address}</td>
                    <td className="py-2.5 text-muted-foreground">{p.county}, {p.state}</td>
                    <td className="py-2.5">{fmt.date(p.saleDate)}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.money(p.minBid)}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.money(p.arv)}</td>
                    <td className="py-2.5 text-right font-mono text-green-500">{fmt.money(p.netProfit)}</td>
                    <td className="py-2.5 text-right font-mono">{p.dealScore}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={p.status === 'Hot Deal' ? 'destructive' : 'outline'}
                        className={`text-xs ${
                          p.status === 'Warm'
                            ? 'border-yellow-500 text-yellow-500'
                            : ''
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </td>
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

function PurchasesTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Purchases</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Address</th>
                <th className="pb-2 font-medium text-right">Purchase Price</th>
                <th className="pb-2 font-medium text-right">Repairs</th>
                <th className="pb-2 font-medium text-right">Sold Price</th>
                <th className="pb-2 font-medium text-right">Actual Profit</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2.5">{p.address}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.money(p.purchasePrice)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.money(p.repairs)}</td>
                  <td className="py-2.5 text-right font-mono">{p.soldPrice != null ? fmt.money(p.soldPrice) : '-'}</td>
                  <td className={`py-2.5 text-right font-mono ${p.actualProfit != null && p.actualProfit >= 0 ? 'text-green-500' : ''}`}>
                    {p.actualProfit != null ? fmt.money(p.actualProfit) : '-'}
                  </td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{p.status}</Badge>
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

export default function RandyRealty() {
  const tabs = [
    { value: 'deals', label: 'Property Deals', content: <PropertyDealsTab /> },
    { value: 'purchases', label: 'Purchases', content: <PurchasesTab /> },
  ];

  return <BotPageLayout botId="randy" tabs={tabs} defaultTab="deals" />;
}
