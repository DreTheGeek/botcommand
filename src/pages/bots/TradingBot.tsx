import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useBotData } from '@/hooks/useBotData';
import { useTrades } from '@/hooks/useExternalData';
import { trades as mockTrades, openPositions, strategies, riskData, fmt as mockFmt } from '@/data/mockData';

const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
  pct: (n: number) => `${n.toFixed(1)}%`,
};

function DashboardTab() {
  const { data: extTrades } = useTrades();
  const tradeData = (extTrades || []).length > 0 ? (extTrades as any[]) : mockTrades;
  const totalPnl = tradeData.reduce((s: number, t: any) => s + (Number(t.pnl) || Number(t.profit) || 0), 0);
  const wins = tradeData.filter((t: any) => t.winLoss === 'W' || t.result === 'W' || (Number(t.pnl || t.profit) || 0) > 0).length;
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
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
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
              <TableHead>Hold Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openPositions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.symbol}</TableCell>
                <TableCell><Badge variant="outline">{p.strategy}</Badge></TableCell>
                <TableCell className="text-right">{p.shares}</TableCell>
                <TableCell className="text-right">{mockFmt.moneyDecimal(p.entryPrice)}</TableCell>
                <TableCell className="text-right">{mockFmt.moneyDecimal(p.currentPrice)}</TableCell>
                <TableCell className={`text-right font-medium ${p.pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>
                  {p.pnl >= 0 ? '+' : ''}{fmt.money(p.pnl)}
                </TableCell>
                <TableCell className="text-right">{mockFmt.moneyDecimal(p.stopLoss)}</TableCell>
                <TableCell className="text-right">{mockFmt.moneyDecimal(p.takeProfit)}</TableCell>
                <TableCell>{p.holdTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TradeHistoryTab() {
  const { data: extTrades } = useTrades();
  const tradeData = (extTrades || []).length > 0 ? (extTrades as any[]) : mockTrades;

  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
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
              const pnl = Number(t.pnl || t.profit || 0);
              const isWin = t.winLoss === 'W' || t.result === 'W' || pnl > 0;
              return (
                <TableRow key={t.id}>
                  <TableCell>{mockFmt.date(t.date || t.created_at || '')}</TableCell>
                  <TableCell className="font-bold">{t.symbol || t.ticker || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{t.strategy || '—'}</Badge></TableCell>
                  <TableCell className="text-right">{t.entry ? mockFmt.moneyDecimal(t.entry) : '—'}</TableCell>
                  <TableCell className="text-right">{t.exit ? mockFmt.moneyDecimal(t.exit) : '—'}</TableCell>
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
      </CardContent>
    </Card>
  );
}

function StrategiesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((s) => (
        <Card key={s.name}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{s.name}</CardTitle>
              <Badge variant={s.status === 'Active' ? 'default' : 'outline'}>{s.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Trades:</span> <span className="font-medium">{s.trades}</span></div>
              <div><span className="text-muted-foreground">Win Rate:</span> <span className="font-medium text-[hsl(var(--nexus-success))]">{s.winRate}%</span></div>
              <div><span className="text-muted-foreground">Avg Profit:</span> <span className="font-medium">{fmt.money(s.avgProfit)}</span></div>
              <div><span className="text-muted-foreground">Max DD:</span> <span className="font-medium text-[hsl(var(--nexus-urgent))]">{fmt.money(s.maxDrawdown)}</span></div>
              <div><span className="text-muted-foreground">Sharpe:</span> <span className="font-medium">{s.sharpeRatio}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RiskMonitorTab() {
  const r = riskData;
  const dailyPct = (r.dailyLossUsed / r.dailyLossLimit) * 100;
  const posPct = (r.positionCount / r.positionLimit) * 100;
  const tradePct = (r.tradeCount / r.tradeLimit) * 100;

  const barColor = (pct: number) => {
    if (pct >= 80) return 'bg-[hsl(var(--nexus-urgent))]';
    if (pct >= 60) return 'bg-[hsl(var(--nexus-warning))]';
    return 'bg-[hsl(var(--nexus-success))]';
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="border-[hsl(var(--nexus-warning))]/30 bg-[hsl(var(--nexus-warning))]/5">
        <AlertTriangle className="h-4 w-4 text-[hsl(var(--nexus-warning))]" />
        <AlertDescription className="text-[hsl(var(--nexus-warning))]">
          One or more risk limits approaching threshold
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Daily Loss', used: r.dailyLossUsed, limit: r.dailyLossLimit, pct: dailyPct, unit: '$' },
          { label: 'Positions', used: r.positionCount, limit: r.positionLimit, pct: posPct, unit: '' },
          { label: 'Trades Today', used: r.tradeCount, limit: r.tradeLimit, pct: tradePct, unit: '' },
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
          <p className="text-2xl font-bold">${r.buyingPower.toLocaleString()}</p>
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
