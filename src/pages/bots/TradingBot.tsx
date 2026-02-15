import { useState } from 'react';
import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { trades, openPositions, strategies, riskData, fmt } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, AlertTriangle } from 'lucide-react';

const balanceData = [
  { day: 'Feb 8', balance: 11800 }, { day: 'Feb 9', balance: 11978 }, { day: 'Feb 10', balance: 12095 },
  { day: 'Feb 11', balance: 12015 }, { day: 'Feb 12', balance: 12179 }, { day: 'Feb 13', balance: 12208 },
  { day: 'Feb 14', balance: 12293 }, { day: 'Feb 15', balance: 12435 },
];

function DashboardTab() {
  const todayPnl = trades.filter((t) => t.date === '2026-02-15').reduce((s, t) => s + t.pnl, 0);
  const weekPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const winRate = (trades.filter((t) => t.winLoss === 'W').length / trades.length * 100);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's P&L", value: fmt.money(todayPnl), color: todayPnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]' },
          { label: 'Week P&L', value: fmt.money(weekPnl), color: 'text-[hsl(var(--nexus-success))]' },
          { label: 'Win Rate', value: fmt.pct(winRate), color: 'text-primary' },
          { label: 'Open Positions', value: openPositions.length.toString(), color: '' },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className={`text-2xl font-bold ${m.color}`}>{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Account Balance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={balanceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" domain={['dataMin - 200', 'dataMax + 200']} /><Tooltip formatter={(v: number) => fmt.money(v)} /><Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function OpenPositionsTab() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Symbol</TableHead><TableHead>Strategy</TableHead><TableHead>Shares</TableHead><TableHead className="text-right">Entry</TableHead><TableHead className="text-right">Current</TableHead><TableHead className="text-right">P&L</TableHead><TableHead>Hold Time</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {openPositions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.symbol}</TableCell>
                <TableCell><Badge variant="outline">{p.strategy}</Badge></TableCell>
                <TableCell>{p.shares}</TableCell>
                <TableCell className="text-right">{fmt.moneyDecimal(p.entryPrice)}</TableCell>
                <TableCell className="text-right">{fmt.moneyDecimal(p.currentPrice)}</TableCell>
                <TableCell className={`text-right font-medium ${p.pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>{p.pnl >= 0 ? '+' : ''}{fmt.moneyDecimal(p.pnl)}</TableCell>
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
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => {
          const csv = ['Date,Symbol,Strategy,Entry,Exit,P&L,W/L,Shares', ...trades.map((t) => `${t.date},${t.symbol},${t.strategy},${t.entry},${t.exit},${t.pnl},${t.winLoss},${t.shares}`)].join('\n');
          const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'trades.csv'; a.click();
        }}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Symbol</TableHead><TableHead>Strategy</TableHead><TableHead className="text-right">Entry</TableHead><TableHead className="text-right">Exit</TableHead><TableHead className="text-right">P&L</TableHead><TableHead>Result</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{fmt.date(t.date)}</TableCell>
                  <TableCell className="font-bold">{t.symbol}</TableCell>
                  <TableCell><Badge variant="outline">{t.strategy}</Badge></TableCell>
                  <TableCell className="text-right">{fmt.moneyDecimal(t.entry)}</TableCell>
                  <TableCell className="text-right">{fmt.moneyDecimal(t.exit)}</TableCell>
                  <TableCell className={`text-right font-medium ${t.pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}`}>{t.pnl >= 0 ? '+' : ''}{fmt.moneyDecimal(t.pnl)}</TableCell>
                  <TableCell><Badge variant={t.winLoss === 'W' ? 'default' : 'destructive'}>{t.winLoss}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StrategiesTab() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Strategy</TableHead><TableHead>Trades</TableHead><TableHead>Win Rate</TableHead><TableHead className="text-right">Avg Profit</TableHead><TableHead className="text-right">Max Drawdown</TableHead><TableHead>Sharpe</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((s) => (
              <TableRow key={s.name}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.trades}</TableCell>
                <TableCell>{fmt.pct(s.winRate)}</TableCell>
                <TableCell className="text-right text-[hsl(var(--nexus-success))]">{fmt.money(s.avgProfit)}</TableCell>
                <TableCell className="text-right text-[hsl(var(--nexus-urgent))]">{fmt.money(s.maxDrawdown)}</TableCell>
                <TableCell>{s.sharpeRatio.toFixed(1)}</TableCell>
                <TableCell><Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RiskMonitorTab() {
  const gauges = [
    { label: 'Daily Loss', used: riskData.dailyLossUsed, limit: riskData.dailyLossLimit, pct: (riskData.dailyLossUsed / riskData.dailyLossLimit) * 100 },
    { label: 'Positions', used: riskData.positionCount, limit: riskData.positionLimit, pct: (riskData.positionCount / riskData.positionLimit) * 100 },
    { label: 'Trades Today', used: riskData.tradeCount, limit: riskData.tradeLimit, pct: (riskData.tradeCount / riskData.tradeLimit) * 100 },
  ];
  const hasWarning = gauges.some((g) => g.pct >= 70);
  return (
    <div className="space-y-4">
      {hasWarning && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--nexus-warning))]/10 border border-[hsl(var(--nexus-warning))]/30 text-sm">
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--nexus-warning))]" />
          <span>One or more risk limits approaching threshold</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gauges.map((g) => (
          <Card key={g.label}>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium">{g.label}</p>
              <Progress value={g.pct} className={g.pct >= 80 ? '[&>div]:bg-[hsl(var(--nexus-urgent))]' : g.pct >= 60 ? '[&>div]:bg-[hsl(var(--nexus-warning))]' : ''} />
              <p className="text-xs text-muted-foreground">{g.used} / {g.limit} ({fmt.pct(g.pct)})</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Buying Power</p>
          <p className="text-2xl font-bold text-primary">{fmt.money(riskData.buyingPower)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const [active, setActive] = useState(true);
  const [paper, setPaper] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Risk Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Max Daily Loss</span><span>{fmt.money(riskData.dailyLossLimit)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Max Positions</span><span>{riskData.positionLimit}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Max Trades/Day</span><span>{riskData.tradeLimit}</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Bot Controls</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Trading Active</p><p className="text-xs text-muted-foreground">Tammy is executing trades</p></div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Paper Trading</p><p className="text-xs text-muted-foreground">Simulate without real money</p></div>
            <Switch checked={paper} onCheckedChange={setPaper} />
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
