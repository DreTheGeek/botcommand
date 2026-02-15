import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBotData } from '@/hooks/useBotData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function ProductsTab() {
  const { data: entries } = useBotData({ botId: 'deondre', category: 'product' });
  const products = (entries || []).map((e) => ({ id: e.id, ...(e.data as Record<string, any>) })) as Array<Record<string, any>>;
  const totalRevenue = products.reduce((s, p) => s + (Number(p.revenue) || Number(p.revenueToday) || 0), 0);

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(totalRevenue)}</p><p className="text-xs text-muted-foreground">Total Product Revenue</p></CardContent></Card>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">ROAS</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>}
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name || p.product || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{p.status || 'New'}</Badge></TableCell>
                  <TableCell className="text-right">{p.revenue || p.revenueToday ? fmt.money(Number(p.revenue || p.revenueToday)) : '—'}</TableCell>
                  <TableCell className="text-right font-medium">{p.roas ? `${Number(p.roas).toFixed(1)}x` : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AllDataTab() {
  const { data: entries } = useBotData({ botId: 'deondre' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Deondre Data</CardTitle></CardHeader>
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

export default function DeondreDropshipping() {
  return (
    <BotPageLayout botId="deondre" tabs={[
      { value: 'products', label: 'Products', content: <ProductsTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
