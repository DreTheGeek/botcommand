import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBotData } from '@/hooks/useBotData';
import { useDeals } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

function PipelineTab() {
  const { data: entries } = useBotData({ botId: 'ana', category: 'prospect' });
  const { data: extDeals } = useDeals();
  const internalProspects = (entries || []).map((e) => ({ id: e.id, ...(e.data as Record<string, any>) }));
  const prospects = (extDeals || []).length > 0 ? (extDeals as any[]) : internalProspects;
  const pipelineValue = prospects.reduce((s: number, p: any) => s + (Number(p.dealSize) || Number(p.deal_size) || Number(p.value) || 0), 0);

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4"><p className="text-2xl font-bold">{fmt.money(pipelineValue)}</p><p className="text-xs text-muted-foreground">Pipeline Value</p></CardContent></Card>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Company</TableHead><TableHead>Contact</TableHead><TableHead className="text-right">Deal Size</TableHead><TableHead>Stage</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {prospects.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No prospects yet</TableCell></TableRow>}
              {prospects.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.company || p.name || '—'}</TableCell>
                  <TableCell>{p.contact || '—'}</TableCell>
                  <TableCell className="text-right">{p.dealSize || p.deal_size || p.value ? fmt.money(Number(p.dealSize || p.deal_size || p.value)) : '—'}</TableCell>
                  <TableCell><Badge variant="outline">{p.stage || 'New'}</Badge></TableCell>
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
  const { data: entries } = useBotData({ botId: 'ana' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Ana Data</CardTitle></CardHeader>
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

export default function AnaSales() {
  return (
    <BotPageLayout botId="ana" tabs={[
      { value: 'pipeline', label: 'Pipeline', content: <PipelineTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
