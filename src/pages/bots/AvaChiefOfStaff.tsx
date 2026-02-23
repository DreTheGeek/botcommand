import { BotPageLayout } from '@/components/bots/BotPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePipeline,
  useProposals,
  useDeals,
  useTrades,
  usePropertyDeals,
  useProducts,
  useContentPosts,
  useBotActivityLog,
  useOpportunities,
} from '@/hooks/useExternalData';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// --- Sales & Pipeline Tab ---
function SalesPipelineTab() {
  const { data: pipeline, isLoading: loadingPipeline } = usePipeline();
  const { data: proposals, isLoading: loadingProposals } = useProposals();
  const { data: deals, isLoading: loadingDeals } = useDeals();

  const active = (pipeline || []).filter((x: any) => !['closed_won', 'closed_lost'].includes(x.stage));
  const pipelineValue = active.reduce((s: number, x: any) => s + (Number(x.deal_value) || Number(x.deal_size) || 0), 0);
  const wonDeals = (deals || []).filter((d: any) => d.status === 'won' || d.status === 'closed_won');
  const wonValue = wonDeals.reduce((s: number, d: any) => s + (Number(d.deal_value) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pipeline Value" value={loadingPipeline ? null : fmt(pipelineValue)} />
        <StatCard label="Active Deals" value={loadingPipeline ? null : `${active.length}`} />
        <StatCard label="Proposals" value={loadingProposals ? null : `${(proposals || []).length}`} />
        <StatCard label="Deals Won" value={loadingDeals ? null : `${wonDeals.length} (${fmt(wonValue)})`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Active Pipeline</CardTitle></CardHeader>
        <CardContent>
          {loadingPipeline ? <Skeleton className="h-40 w-full" /> : active.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No active deals in pipeline</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Prospect</th>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium text-right">Value</th>
                </tr></thead>
                <tbody>
                  {active.slice(0, 20).map((deal: any, i: number) => (
                    <tr key={deal.id || i} className="border-b border-border/50">
                      <td className="py-2.5">{deal.prospect_name || deal.contact_name || '-'}</td>
                      <td className="py-2.5 text-muted-foreground">{deal.company || '-'}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-xs">{deal.stage}</Badge></td>
                      <td className="py-2.5 text-right font-mono">{fmt(Number(deal.deal_value) || Number(deal.deal_size) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Trading Tab ---
function TradingTab() {
  const { data: trades, isLoading } = useTrades();

  const closed = (trades || []).filter((t: any) => t.status === 'closed');
  const open = (trades || []).filter((t: any) => t.status !== 'closed');
  const totalPnl = closed.reduce((s: number, t: any) => s + (Number(t.pnl) || 0), 0);
  const wins = closed.filter((t: any) => (Number(t.pnl) || 0) > 0).length;
  const winRate = closed.length > 0 ? Math.round((wins / closed.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total P&L" value={isLoading ? null : `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`} />
        <StatCard label="Win Rate" value={isLoading ? null : `${winRate}%`} />
        <StatCard label="Closed Trades" value={isLoading ? null : `${closed.length}`} />
        <StatCard label="Open Positions" value={isLoading ? null : `${open.length}`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Trades</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-40 w-full" /> : closed.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No closed trades yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Symbol</th>
                  <th className="pb-2 font-medium">Side</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">P&L</th>
                </tr></thead>
                <tbody>
                  {closed.slice(0, 20).map((trade: any, i: number) => (
                    <tr key={trade.id || i} className="border-b border-border/50">
                      <td className="py-2.5 font-mono font-medium">{trade.symbol || trade.ticker || '-'}</td>
                      <td className="py-2.5">{trade.side || trade.direction || '-'}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-xs">{trade.status}</Badge></td>
                      <td className={`py-2.5 text-right font-mono ${(Number(trade.pnl) || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(Number(trade.pnl) || 0) >= 0 ? '+' : ''}${(Number(trade.pnl) || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Real Estate Tab ---
function RealEstateTab() {
  const { data: deals, isLoading } = usePropertyDeals();

  const hotDeals = (deals || []).filter((x: any) => (Number(x.net_profit) || 0) >= 40000);
  const totalProfit = hotDeals.reduce((s: number, x: any) => s + (Number(x.net_profit) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Deals" value={isLoading ? null : `${(deals || []).length}`} />
        <StatCard label="Hot Deals ($40K+)" value={isLoading ? null : `${hotDeals.length}`} />
        <StatCard label="Total Profit Potential" value={isLoading ? null : fmt(totalProfit)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Property Deals</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-40 w-full" /> : (deals || []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No property deals found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">State</th>
                  <th className="pb-2 font-medium text-right">Net Profit</th>
                  <th className="pb-2 font-medium text-right">Score</th>
                </tr></thead>
                <tbody>
                  {(deals || []).slice(0, 20).map((deal: any, i: number) => (
                    <tr key={deal.id || i} className="border-b border-border/50">
                      <td className="py-2.5">{deal.address || deal.county || '-'}</td>
                      <td className="py-2.5 text-muted-foreground">{deal.state || '-'}</td>
                      <td className="py-2.5 text-right font-mono">{fmt(Number(deal.net_profit) || 0)}</td>
                      <td className="py-2.5 text-right">{deal.score || deal.deal_score || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- E-Commerce Tab ---
function EcommerceTab() {
  const { data: products, isLoading } = useProducts();

  const scaling = (products || []).filter((p: any) => ['scaling', 'winner'].includes((p.status || '').toLowerCase()));
  const testing = (products || []).filter((p: any) => (p.status || '').toLowerCase() === 'testing');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={isLoading ? null : `${(products || []).length}`} />
        <StatCard label="Scaling/Winners" value={isLoading ? null : `${scaling.length}`} />
        <StatCard label="Testing" value={isLoading ? null : `${testing.length}`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Products</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-40 w-full" /> : (products || []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No products tracked</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">ROAS</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                </tr></thead>
                <tbody>
                  {(products || []).slice(0, 20).map((p: any, i: number) => (
                    <tr key={p.id || i} className="border-b border-border/50">
                      <td className="py-2.5">{p.name || p.product_name || '-'}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-xs">{p.status || '-'}</Badge></td>
                      <td className="py-2.5 text-right font-mono">{(Number(p.roas) || Number(p.avg_roas) || 0).toFixed(1)}x</td>
                      <td className="py-2.5 text-right font-mono">{fmt(Number(p.revenue) || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Intelligence Tab ---
function IntelligenceTab() {
  const { data: opportunities, isLoading: loadingOpps } = useOpportunities();
  const { data: content, isLoading: loadingContent } = useContentPosts();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Opportunities" value={loadingOpps ? null : `${(opportunities || []).length}`} />
        <StatCard label="High Priority" value={loadingOpps ? null : `${(opportunities || []).filter((o: any) => o.priority === 'high').length}`} />
        <StatCard label="Content Posts" value={loadingContent ? null : `${(content || []).length}`} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Research & Opportunities</CardTitle></CardHeader>
        <CardContent>
          {loadingOpps ? <Skeleton className="h-40 w-full" /> : (opportunities || []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No opportunities tracked</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Opportunity</th>
                  <th className="pb-2 font-medium">Priority</th>
                  <th className="pb-2 font-medium">Source</th>
                </tr></thead>
                <tbody>
                  {(opportunities || []).slice(0, 20).map((opp: any, i: number) => (
                    <tr key={opp.id || i} className="border-b border-border/50">
                      <td className="py-2.5">{opp.title || opp.name || opp.description || '-'}</td>
                      <td className="py-2.5"><Badge variant={opp.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">{opp.priority || '-'}</Badge></td>
                      <td className="py-2.5 text-muted-foreground">{opp.source || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Activity Log Tab ---
function ActivityLogTab() {
  const { data: activity, isLoading } = useBotActivityLog(50);

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-60 w-full" /> : (activity || []).length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No activity logged</p>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {(activity || []).map((entry: any, i: number) => (
              <div key={entry.id || i} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{entry.action || entry.message || '-'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.role && <Badge variant="outline" className="text-[10px]">{entry.role}</Badge>}
                    {entry.entity_type && <span className="text-[10px] text-muted-foreground">{entry.entity_type}</span>}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Stat Card Helper ---
function StatCard({ label, value }: { label: string; value: string | null }) {
  return (
    <Card>
      <CardContent className="p-4">
        {value === null ? <Skeleton className="h-6 w-24 mb-1" /> : (
          <p className="text-lg font-mono font-bold text-primary">{value}</p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function AvaChiefOfStaff() {
  const tabs = [
    { value: 'sales', label: 'Sales & Pipeline', content: <SalesPipelineTab /> },
    { value: 'trading', label: 'Trading', content: <TradingTab /> },
    { value: 'realestate', label: 'Real Estate', content: <RealEstateTab /> },
    { value: 'ecommerce', label: 'E-Commerce', content: <EcommerceTab /> },
    { value: 'intelligence', label: 'Intelligence', content: <IntelligenceTab /> },
    { value: 'activity', label: 'Activity Log', content: <ActivityLogTab /> },
  ];

  return <BotPageLayout botId="ava" tabs={tabs} defaultTab="sales" />;
}
