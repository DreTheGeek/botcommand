import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBotData } from '@/hooks/useBotData';
import { useTrades } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
  pct: (n: number) => `${n.toFixed(1)}%`,
};

function DashboardTab() {
  const { data: entries } = useBotData({ botId: 'tammy', category: 'trade' });
  const { data: extTrades } = useTrades();
  const internalTrades = (entries || []).map((e) => e.data as Record<string, any>);
  const trades = (extTrades || []).length > 0 ? (extTrades as Record<string, any>[]) : internalTrades;
  const totalPnl = trades.reduce((s, t) => s + (Number(t.pnl) || Number(t.profit) || 0), 0);
  const wins = trades.filter((t) => t.result === 'W' || (Number(t.pnl || t.profit) || 0) > 0).length;
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total P&L', value: fmt.money(totalPnl), color: totalPnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]' },
          { label: 'Total Trades', value: trades.length.toString(), color: '' },
          { label: 'Win Rate', value: fmt.pct(winRate), color: 'text-primary' },
          { label: 'Wins', value: wins.toString(), color: 'text-[hsl(var(--nexus-success))]' },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      {trades.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No trades yet.</p>}
    </div>
  );
}

function TradeHistoryTab() {
  const { data: entries } = useBotData({ botId: 'tammy', category: 'trade' });
  const { data: extTrades } = useTrades();
  const internalTrades = (entries || []).map((e) => ({ id: e.id, created: e.created_at, ...(e.data as Record<string, any>) }));
  const trades = (extTrades || []).length > 0 ? (extTrades as any[]) : internalTrades;

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Date</TableHead><TableHead>Symbol</TableHead><TableHead>Strategy</TableHead><TableHead className="text-right">P&L</TableHead><TableHead>Result</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {trades.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No trades yet</TableCell></TableRow>}
            {trades.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.created || t.created_at || t.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-bold">{t.symbol || t.ticker || '—'}</TableCell>
                <TableCell><Badge variant="outline">{t.strategy || '—'}</Badge></TableCell>
                <TableCell className={`text-right font-medium ${(Number(t.pnl || t.profit) || 0) >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                  {(Number(t.pnl || t.profit) || 0) >= 0 ? '+' : ''}{fmt.money(Number(t.pnl || t.profit) || 0)}
                </TableCell>
                <TableCell><Badge variant={(Number(t.pnl || t.profit) || 0) > 0 ? 'default' : 'destructive'}>{t.result || ((Number(t.pnl || t.profit) || 0) > 0 ? 'W' : 'L')}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AllDataTab() {
  const { data: entries } = useBotData({ botId: 'tammy' });
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">All Tammy Data</CardTitle></CardHeader>
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

export default function TradingBot() {
  return (
    <BotPageLayout botId="trading" tabs={[
      { value: 'dashboard', label: 'Dashboard', content: <DashboardTab /> },
      { value: 'history', label: 'Trade History', content: <TradeHistoryTab /> },
      { value: 'all', label: 'All Data', content: <AllDataTab /> },
    ]} />
  );
}
