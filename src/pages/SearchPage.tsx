import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { properties, prospects, trades, scheduledContent, products } from '@/data/mockData';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();

  const propResults = q ? properties.filter((p) => p.address.toLowerCase().includes(q) || p.county.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)) : [];
  const prospectResults = q ? prospects.filter((p) => p.company.toLowerCase().includes(q) || p.contact.toLowerCase().includes(q)) : [];
  const tradeResults = q ? trades.filter((t) => t.symbol.toLowerCase().includes(q)) : [];
  const contentResults = q ? scheduledContent.filter((c) => c.title.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q)) : [];
  const productResults = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : [];
  const totalResults = propResults.length + prospectResults.length + tradeResults.length + contentResults.length + productResults.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search properties, prospects, trades, content, products..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11 h-12 text-base" autoFocus />
      </div>
      {q && <p className="text-sm text-muted-foreground">{totalResults} results found</p>}

      {propResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Properties ({propResults.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {propResults.map((p) => <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"><span className="font-medium">{p.address}</span><div className="flex gap-2"><Badge variant="outline">{p.state}</Badge><span className="text-[hsl(var(--nexus-success))]">${(p.netProfit / 1000).toFixed(0)}K profit</span></div></div>)}
          </CardContent>
        </Card>
      )}
      {prospectResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Prospects ({prospectResults.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {prospectResults.map((p) => <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"><span className="font-medium">{p.company}</span><div className="flex gap-2"><Badge variant="outline">{p.stage}</Badge><span>${(p.dealSize / 1000).toFixed(0)}K</span></div></div>)}
          </CardContent>
        </Card>
      )}
      {tradeResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Trades ({tradeResults.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tradeResults.map((t) => <div key={t.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"><span className="font-bold">{t.symbol}</span><div className="flex gap-2"><Badge variant="outline">{t.strategy}</Badge><span className={t.pnl >= 0 ? 'text-[hsl(var(--nexus-success))]' : 'text-[hsl(var(--nexus-urgent))]'}>{t.pnl >= 0 ? '+' : ''}${t.pnl}</span></div></div>)}
          </CardContent>
        </Card>
      )}
      {contentResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Content ({contentResults.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {contentResults.map((c) => <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"><span className="font-medium">{c.title}</span><Badge variant="outline">{c.platform}</Badge></div>)}
          </CardContent>
        </Card>
      )}
      {productResults.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Products ({productResults.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {productResults.map((p) => <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"><span className="font-medium">{p.name}</span><div className="flex gap-2"><Badge variant="outline">{p.status}</Badge><span>{p.roas.toFixed(1)}x ROAS</span></div></div>)}
          </CardContent>
        </Card>
      )}
      {q && totalResults === 0 && <p className="text-center text-muted-foreground py-12">No results found for "{query}"</p>}
      {!q && <p className="text-center text-muted-foreground py-12">Start typing to search across all bots</p>}
    </motion.div>
  );
}
