import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTrades } from '@/hooks/useExternalData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
  pct: (n: number) => `${n.toFixed(1)}%`,
  date: (d: string) => d ? new Date(d).toLocaleDateString() : '—',
};

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{message}</p>;
}

function DashboardTab() {
  const { data: extTrades } = useTrades();
  const tradeData = (extTrades || []) as any[];
  const totalPnl = tradeData.reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const wins = tradeData.filter((t) => (Number(t.pnl) || 0) > 0).length;
  const winRate = tradeData.length > 0 ? (wins / tradeData.length) * 100 : 0;
  const avgProfit = tradeData.length > 0 ? totalPnl / tradeData.length : 0;

  const metrics = [
    { label: 'Total P&L', value: fmt.money(totalPnl), color: totalPnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]' },
    { label: 'Win Rate', value: fmt.pct(winRate), color: 'text-primary' },
    { label: 'Total Trades', value: tradeData.length.toString(), color: '' },
    { label: 'Avg Profit', value: fmt.money(avgProfit), color: avgProfit >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <Card key={m.label}><CardContent className="p-4"><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
      ))}
    </div>
  );
}

function OpenPositionsTab() {
  const { data: extTrades } = useTrades();
  const positions = ((extTrades || []) as any[]).filter((t) => t.status === 'open');

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {positions.length === 0 ? <EmptyState message="No open positions" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Stop Loss</TableHead>
                <TableHead className="text-right">Take Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p: any) => {
                const pnl = Number(p.pnl) || 0;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">{p.symbol || p.ticker || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{p.strategy || '—'}</Badge></TableCell>
                    <TableCell className="text-right">{p.shares || '—'}</TableCell>
                    <TableCell className="text-right">{p.entry_price ? fmt.money(Number(p.entry_price)) : '—'}</TableCell>
                    <TableCell className="text-right">{p.current_price ? fmt.money(Number(p.current_price)) : '—'}</TableCell>
                    <TableCell className={`text-right font-medium ${pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                      {pnl >= 0 ? '+' : ''}{fmt.money(pnl)}
                    </TableCell>
                    <TableCell className="text-right">{p.stop_loss ? fmt.money(Number(p.stop_loss)) : '—'}</TableCell>
                    <TableCell className="text-right">{p.take_profit ? fmt.money(Number(p.take_profit)) : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function TradeHistoryTab() {
  const { data: extTrades } = useTrades();
  const tradeData = ((extTrades || []) as any[]).filter((t) => t.status === 'closed');

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        {tradeData.length === 0 ? <EmptyState message="No trades recorded yet" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Exit</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradeData.map((t: any) => {
                const pnl = Number(t.pnl) || 0;
                const isWin = pnl > 0;
                return (
                  <TableRow key={t.id}>
                    <TableCell>{fmt.date(t.closed_at || t.created_at || '')}</TableCell>
                    <TableCell className="font-bold">{t.symbol || t.ticker || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{t.strategy || '—'}</Badge></TableCell>
                    <TableCell className="text-right">{t.entry_price ? fmt.money(Number(t.entry_price)) : '—'}</TableCell>
                    <TableCell className="text-right">{t.exit_price ? fmt.money(Number(t.exit_price)) : '—'}</TableCell>
                    <TableCell className={`text-right font-medium ${pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                      {pnl >= 0 ? '+' : ''}{fmt.money(pnl)}
                    </TableCell>
                    <TableCell><Badge variant={isWin ? 'default' : 'destructive'}>{isWin ? 'W' : 'L'}</Badge></TableCell>
                    <TableCell className="text-right">{t.shares || '—'}</TableCell>
                    <TableCell className="text-right">{t.confidence ? `${t.confidence}%` : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function StrategiesTab() {
  // Strategies would come from an external table
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EmptyState message="No strategies configured yet" />
    </div>
  );
}

function RiskMonitorTab() {
  // Risk data would come from an external table
  const barColor = (pct: number) => {
    if (pct >= 80) return 'bg-[hsl(var(--nexus-urgent))]';
    if (pct >= 60) return 'bg-[hsl(var(--nexus-warning))]';
    return 'bg-[hsl(var(--nexus-success))]';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Daily Loss', used: 0, limit: 0, pct: 0, unit: '$' },
          { label: 'Positions', used: 0, limit: 0, pct: 0, unit: '' },
          { label: 'Trades Today', used: 0, limit: 0, pct: 0, unit: '' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.unit}{item.used}/{item.unit}{item.limit} ({item.pct.toFixed(1)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor(item.pct)}`} style={{ width: `${item.pct}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Buying Power</p>
          <p className="text-2xl font-bold">$0</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Trading Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Daily Loss Limit', value: '$200' },
            { label: 'Max Positions', value: '5' },
            { label: 'Max Trades/Day', value: '15' },
            { label: 'Min Confidence', value: '60%' },
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
            <span className="text-sm text-muted-foreground">Auto-Execute Trades</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Risk Alerts</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TradingBot() {
  return (
    <BotPageLayout botId="trading" tabs={[
      { value: 'dashboard', label: 'Dashboard', content: <DashboardTab /> },
      { value: 'positions', label: 'Open Positions', content: <OpenPositionsTab /> },
      { value: 'history', label: 'Trade History', content: <TradeHistoryTab /> },
      { value: 'strategies', label: 'Strategies', content: <StrategiesTab /> },
      { value: 'risk', label: 'Risk Monitor', content: <RiskMonitorTab /> },
      { value: 'settings', label: 'Settings', content: <SettingsTab /> },
    ]} />
  );
}
