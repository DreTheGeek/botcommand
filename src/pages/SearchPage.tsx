import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { usePropertyDeals, useDeals, useTrades, useContentPosts, useProducts } from '@/hooks/useExternalData';
import { useBotData } from '@/hooks/useBotData';
import { Search } from 'lucide-react';

const fmt = {
  money: (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
};

const BOT_NAMES: Record<string, string> = {
  ronnie: 'Ronnie Realty', ana: 'Ana Sales', tammy: 'Tammy Trader',
  rhianna: 'Rhianna Research', deondre: 'Deondre Dropshipping',
  carter: 'Carter Content', trading: 'Tammy Trader',
};

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title} ({count})</CardTitle></CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase().trim();

  const { data: properties = [], isLoading: loadingProps } = usePropertyDeals(200);
  const { data: deals = [], isLoading: loadingDeals } = useDeals(200);
  const { data: trades = [], isLoading: loadingTrades } = useTrades(200);
  const { data: contentPosts = [], isLoading: loadingContent } = useContentPosts(200);
  const { data: products = [], isLoading: loadingProducts } = useProducts(200);
  const { data: botDataEntries = [], isLoading: loadingBotData } = useBotData({ limit: 200 });

  const isLoading = loadingProps || loadingDeals || loadingTrades || loadingContent || loadingProducts || loadingBotData;

  const propResults = useMemo(() => {
    if (!q) return [];
    return (properties as any[]).filter((p) =>
      [p.address, p.county, p.state, p.status].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [properties, q]);

  const dealResults = useMemo(() => {
    if (!q) return [];
    return (deals as any[]).filter((d) =>
      [d.company, d.contact, d.stage, d.name].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [deals, q]);

  const tradeResults = useMemo(() => {
    if (!q) return [];
    return (trades as any[]).filter((t) =>
      [t.symbol, t.ticker, t.strategy, t.status].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [trades, q]);

  const contentResults = useMemo(() => {
    if (!q) return [];
    return (contentPosts as any[]).filter((c) =>
      [c.title, c.platform, c.content, c.status].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [contentPosts, q]);

  const productResults = useMemo(() => {
    if (!q) return [];
    return (products as any[]).filter((p) =>
      [p.name, p.status, p.supplier, p.niche].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [products, q]);

  const botDataResults = useMemo(() => {
    if (!q) return [];
    return (botDataEntries as any[]).filter((e) =>
      [e.bot_id, e.category, JSON.stringify(e.data)].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [botDataEntries, q]);

  const totalResults =
    propResults.length + dealResults.length + tradeResults.length +
    contentResults.length + productResults.length + botDataResults.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Search</h1>

      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search properties, deals, trades, content, products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 text-base"
          autoFocus
        />
      </div>

      {isLoading && !q && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}

      {q && (
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Searching...' : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
        </p>
      )}

      {propResults.length > 0 && (
        <ResultSection title="Properties" count={propResults.length}>
          {propResults.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
              <span className="font-medium">{p.address || '—'}</span>
              <div className="flex gap-2 items-center flex-wrap">
                {p.state && <Badge variant="outline">{p.state}</Badge>}
                {p.net_profit && <span className="text-[hsl(var(--nexus-success))]">{fmt.money(Number(p.net_profit))} profit</span>}
                {p.status && <Badge variant="outline">{p.status}</Badge>}
              </div>
            </div>
          ))}
        </ResultSection>
      )}

      {dealResults.length > 0 && (
        <ResultSection title="Deals / Prospects" count={dealResults.length}>
          {dealResults.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
              <span className="font-medium">{d.company || d.name || '—'}</span>
              <div className="flex gap-2 items-center">
                {d.stage && <Badge variant="outline">{d.stage}</Badge>}
                {d.deal_size && <span>{fmt.money(Number(d.deal_size))}</span>}
              </div>
            </div>
          ))}
        </ResultSection>
      )}

      {tradeResults.length > 0 && (
        <ResultSection title="Trades" count={tradeResults.length}>
          {tradeResults.map((t: any) => {
            const pnl = Number(t.pnl) || 0;
            return (
              <div key={t.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                <span className="font-bold">{t.symbol || t.ticker || '—'}</span>
                <div className="flex gap-2 items-center">
                  {t.strategy && <Badge variant="outline">{t.strategy}</Badge>}
                  {t.pnl !== undefined && (
                    <span className={pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}>
                      {pnl >= 0 ? '+' : ''}{fmt.money(pnl)}
                    </span>
                  )}
                  {t.status && <Badge variant="outline">{t.status}</Badge>}
                </div>
              </div>
            );
          })}
        </ResultSection>
      )}

      {contentResults.length > 0 && (
        <ResultSection title="Content" count={contentResults.length}>
          {contentResults.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
              <span className="font-medium truncate max-w-[60%]">{c.title || c.content?.slice(0, 60) || '—'}</span>
              <div className="flex gap-2">
                {c.platform && <Badge variant="outline">{c.platform}</Badge>}
                {c.status && <Badge variant="outline">{c.status}</Badge>}
              </div>
            </div>
          ))}
        </ResultSection>
      )}

      {productResults.length > 0 && (
        <ResultSection title="Products" count={productResults.length}>
          {productResults.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
              <span className="font-medium">{p.name || '—'}</span>
              <div className="flex gap-2 items-center">
                {p.status && <Badge variant="outline">{p.status}</Badge>}
                {p.roas && <span>{Number(p.roas).toFixed(1)}x ROAS</span>}
              </div>
            </div>
          ))}
        </ResultSection>
      )}

      {botDataResults.length > 0 && (
        <ResultSection title="Bot Data Entries" count={botDataResults.length}>
          {botDataResults.slice(0, 20).map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
              <span className="font-medium">{BOT_NAMES[e.bot_id] || e.bot_id}</span>
              <div className="flex gap-2 items-center">
                <Badge variant="outline">{e.category}</Badge>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {JSON.stringify(e.data).slice(0, 60)}
                </span>
              </div>
            </div>
          ))}
        </ResultSection>
      )}

      {q && !isLoading && totalResults === 0 && (
        <p className="text-center text-muted-foreground py-12">No results found for "{query}"</p>
      )}
      {!q && (
        <p className="text-center text-muted-foreground py-12">Start typing to search across all bots</p>
      )}
    </motion.div>
  );
}
