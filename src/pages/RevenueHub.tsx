import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBotData, aggregateRevenue } from '@/hooks/useBotData';
import { useRevenueTracking } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

export default function RevenueHub() {
  const { data: entries } = useBotData({ categories: ['trade', 'revenue', 'property_deal', 'product'] });
  const { data: extRevenue } = useRevenueTracking();
  const rev = aggregateRevenue(entries || []);
  const extTotal = (extRevenue || []).reduce((s: number, r: any) => s + (Number(r.amount) || Number(r.revenue) || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Revenue Hub</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt.money(extTotal > 0 ? extTotal : rev.total) },
          { label: 'Property Deals', value: fmt.money(rev.property) },
          { label: 'Trading Profits', value: fmt.money(rev.trading) },
          { label: 'Dropshipping', value: fmt.money(rev.dropshipping) },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Revenue Entries</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(entries || []).length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet.</p>}
          {(entries || []).map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
              <div>
                <span className="font-medium">{e.bot_id}</span>
                <span className="text-muted-foreground ml-2">{e.category}</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
