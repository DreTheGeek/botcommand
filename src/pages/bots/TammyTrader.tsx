import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trades, openPositions, strategies, riskData, fmt } from '@/data/mockData';

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

function TradesTab() {
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const wins = trades.filter((t) => t.winLoss === 'W').length;
  const winRate = Math.round((wins / trades.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total P&L" value={`${totalPnl >= 0 ? '+' : ''}${fmt.moneyDecimal(totalPnl)}`} />
        <StatCard label="Win Rate" value={`${winRate}%`} />
        <StatCard label="Total Trades" value={`${trades.length}`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Trade History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Symbol</th>
                  <th className="pb-2 font-medium">Strategy</th>
                  <th className="pb-2 font-medium text-right">Entry</th>
                  <th className="pb-2 font-medium text-right">Exit</th>
                  <th className="pb-2 font-medium text-right">P&L</th>
                  <th className="pb-2 font-medium">W/L</th>
                  <th className="pb-2 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-2.5 text-muted-foreground">{t.date}</td>
                    <td className="py-2.5 font-mono font-medium">{t.symbol}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-xs">{t.strategy}</Badge>
                    </td>
                    <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(t.entry)}</td>
                    <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(t.exit)}</td>
                    <td className={`py-2.5 text-right font-mono ${t.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {t.pnl >= 0 ? '+' : ''}{fmt.moneyDecimal(t.pnl)}
                    </td>
                    <td className="py-2.5">
                      <Badge
                        variant={t.winLoss === 'W' ? 'outline' : 'destructive'}
                        className={`text-xs ${t.winLoss === 'W' ? 'border-green-500 text-green-500' : ''}`}
                      >
                        {t.winLoss}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right font-mono">{t.confidence}%</td>
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

function OpenPositionsTab() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Open Positions</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-left">
                <th className="pb-2 font-medium">Symbol</th>
                <th className="pb-2 font-medium">Strategy</th>
                <th className="pb-2 font-medium text-right">Shares</th>
                <th className="pb-2 font-medium text-right">Entry Price</th>
                <th className="pb-2 font-medium text-right">Current Price</th>
                <th className="pb-2 font-medium text-right">P&L</th>
                <th className="pb-2 font-medium text-right">Stop Loss</th>
                <th className="pb-2 font-medium text-right">Take Profit</th>
                <th className="pb-2 font-medium">Hold Time</th>
              </tr>
            </thead>
            <tbody>
              {openPositions.map((pos) => (
                <tr key={pos.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono font-medium">{pos.symbol}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-xs">{pos.strategy}</Badge>
                  </td>
                  <td className="py-2.5 text-right font-mono">{pos.shares}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(pos.entryPrice)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(pos.currentPrice)}</td>
                  <td className={`py-2.5 text-right font-mono ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{fmt.moneyDecimal(pos.pnl)}
                  </td>
                  <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(pos.stopLoss)}</td>
                  <td className="py-2.5 text-right font-mono">{fmt.moneyDecimal(pos.takeProfit)}</td>
                  <td className="py-2.5 text-muted-foreground">{pos.holdTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function StrategiesTab() {
  const lossPercent = Math.round((riskData.dailyLossUsed / riskData.dailyLossLimit) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Strategies</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium text-right">Trades</th>
                  <th className="pb-2 font-medium text-right">Win Rate %</th>
                  <th className="pb-2 font-medium text-right">Avg Profit</th>
                  <th className="pb-2 font-medium text-right">Max Drawdown</th>
                  <th className="pb-2 font-medium text-right">Sharpe Ratio</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((s) => (
                  <tr key={s.name} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{s.name}</td>
                    <td className="py-2.5 text-right font-mono">{s.trades}</td>
                    <td className="py-2.5 text-right font-mono">{s.winRate}%</td>
                    <td className="py-2.5 text-right font-mono text-green-500">{fmt.moneyDecimal(s.avgProfit)}</td>
                    <td className="py-2.5 text-right font-mono text-red-500">{fmt.moneyDecimal(s.maxDrawdown)}</td>
                    <td className="py-2.5 text-right font-mono">{s.sharpeRatio.toFixed(1)}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-xs">{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Risk Management</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Daily Loss</span>
              <span className="font-mono">{fmt.moneyDecimal(riskData.dailyLossUsed)} / {fmt.moneyDecimal(riskData.dailyLossLimit)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${lossPercent >= 80 ? 'bg-red-500' : lossPercent >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(lossPercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Positions</span>
              <span className="font-mono font-bold">{riskData.positionCount} / {riskData.positionLimit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trades Today</span>
              <span className="font-mono font-bold">{riskData.tradeCount} / {riskData.tradeLimit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Buying Power</span>
              <span className="font-mono font-bold">{fmt.money(riskData.buyingPower)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TammyTrader() {
  const tabs = [
    { value: 'trades', label: 'Trades', content: <TradesTab /> },
    { value: 'positions', label: 'Open Positions', content: <OpenPositionsTab /> },
    { value: 'strategies', label: 'Strategies', content: <StrategiesTab /> },
  ];

  return <BotPageLayout botId="tammy" tabs={tabs} defaultTab="trades" />;
}
