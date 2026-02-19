import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePropertyDeals, useDeals, useTrades, useProducts } from '@/hooks/useExternalData';
import { useBotData } from '@/hooks/useBotData';
import { Download, Database, Activity, CheckCircle, RefreshCw } from 'lucide-react';

const fmt = {
  money: (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  moneyDecimal: (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
};

const TABLE_OPTIONS = [
  { value: 'properties', label: 'Properties (Ronnie)' },
  { value: 'deals', label: 'Deals (Ana)' },
  { value: 'trades', label: 'Trades (Tammy)' },
  { value: 'products', label: 'Products (Deondre)' },
  { value: 'bot_data', label: 'Bot Data Entries' },
];

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RawData() {
  const [selectedTable, setSelectedTable] = useState('properties');

  const { data: properties = [], isLoading: loadingProps, refetch: refetchProps } = usePropertyDeals(500);
  const { data: deals = [], isLoading: loadingDeals, refetch: refetchDeals } = useDeals(500);
  const { data: trades = [], isLoading: loadingTrades, refetch: refetchTrades } = useTrades(500);
  const { data: products = [], isLoading: loadingProducts, refetch: refetchProducts } = useProducts(500);
  const { data: botData = [], isLoading: loadingBotData, refetch: refetchBotData } = useBotData({ limit: 500 });

  const tableData = useMemo(() => {
    switch (selectedTable) {
      case 'properties':
        return {
          headers: ['Address', 'County', 'State', 'Sale Date', 'Min Bid', 'Net Profit', 'Score', 'Status'],
          rows: (properties as any[]).map((p) => [
            p.address || '—', p.county || '—', p.state || '—',
            p.sale_date ? new Date(p.sale_date).toLocaleDateString() : '—',
            p.min_bid ? fmt.money(Number(p.min_bid)) : '—',
            p.net_profit ? fmt.money(Number(p.net_profit)) : '—',
            String(p.deal_score || '—'), p.status || '—',
          ]),
          isLoading: loadingProps,
          data: properties,
        };
      case 'deals':
        return {
          headers: ['Company', 'Contact', 'Deal Size', 'Stage', 'Days in Stage', 'Next Action'],
          rows: (deals as any[]).map((d) => [
            d.company || d.name || '—', d.contact || '—',
            d.deal_size ? fmt.money(Number(d.deal_size)) : '—',
            d.stage || '—', String(d.days_in_stage || '—'), d.next_action || '—',
          ]),
          isLoading: loadingDeals,
          data: deals,
        };
      case 'trades':
        return {
          headers: ['Symbol', 'Strategy', 'Status', 'Entry Price', 'Exit Price', 'P&L', 'Shares'],
          rows: (trades as any[]).map((t) => [
            t.symbol || t.ticker || '—', t.strategy || '—', t.status || '—',
            t.entry_price ? fmt.moneyDecimal(Number(t.entry_price)) : '—',
            t.exit_price ? fmt.moneyDecimal(Number(t.exit_price)) : '—',
            t.pnl !== undefined ? fmt.moneyDecimal(Number(t.pnl)) : '—',
            String(t.shares || '—'),
          ]),
          isLoading: loadingTrades,
          data: trades,
        };
      case 'products':
        return {
          headers: ['Name', 'Status', 'ROAS', 'Revenue Today', 'Orders Today', 'Niche'],
          rows: (products as any[]).map((p) => [
            p.name || '—', p.status || '—',
            p.roas ? `${Number(p.roas).toFixed(1)}x` : '—',
            p.revenue_today ? fmt.money(Number(p.revenue_today)) : '—',
            String(p.orders_today || '—'), p.niche || '—',
          ]),
          isLoading: loadingProducts,
          data: products,
        };
      case 'bot_data':
        return {
          headers: ['Bot', 'Category', 'Created At', 'Data Preview'],
          rows: (botData as any[]).map((e) => [
            e.bot_id || '—', e.category || '—',
            new Date(e.created_at).toLocaleString(),
            JSON.stringify(e.data || {}).slice(0, 120),
          ]),
          isLoading: loadingBotData,
          data: botData,
        };
      default:
        return { headers: [], rows: [], isLoading: false, data: [] };
    }
  }, [selectedTable, properties, deals, trades, products, botData,
    loadingProps, loadingDeals, loadingTrades, loadingProducts, loadingBotData]);

  const handleRefresh = () => {
    switch (selectedTable) {
      case 'properties': refetchProps(); break;
      case 'deals': refetchDeals(); break;
      case 'trades': refetchTrades(); break;
      case 'products': refetchProducts(); break;
      case 'bot_data': refetchBotData(); break;
    }
  };

  const handleExport = () => {
    if (tableData.rows.length === 0) return;
    downloadCSV(tableData.headers, tableData.rows, selectedTable);
  };

  const totalRecords = (properties as any[]).length + (deals as any[]).length +
    (trades as any[]).length + (products as any[]).length + (botData as any[]).length;

  const anyLoading = loadingProps || loadingDeals || loadingTrades || loadingProducts || loadingBotData;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Raw Data</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Connection', value: 'Connected', icon: CheckCircle, color: 'text-[hsl(var(--nexus-success))]' },
          { label: 'Tables', value: TABLE_OPTIONS.length.toString(), icon: Database, color: 'text-primary' },
          {
            label: 'Total Records',
            value: anyLoading ? '...' : totalRecords.toLocaleString(),
            icon: Activity,
            color: 'text-[hsl(var(--nexus-info))]',
          },
          {
            label: 'Current Table',
            value: tableData.isLoading ? '...' : `${tableData.rows.length} rows`,
            icon: CheckCircle,
            color: 'text-muted-foreground',
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-6 w-6 ${m.color}`} />
              <div>
                <p className="font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedTable} onValueChange={setSelectedTable}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TABLE_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={tableData.isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${tableData.isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={tableData.rows.length === 0}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
        {tableData.rows.length > 0 && (
          <Badge variant="outline">{tableData.rows.length} records</Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {tableData.isLoading ? (
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : tableData.rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No data yet — this table is empty.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {tableData.headers.map((h) => <TableHead key={h}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="text-sm max-w-[200px] truncate">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Database Info</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {TABLE_OPTIONS.map((t) => (
            <div key={t.value} className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span className="text-sm">{t.label}</span>
              <Badge variant="outline" className="text-[10px]">
                {t.value === 'properties' ? (properties as any[]).length :
                  t.value === 'deals' ? (deals as any[]).length :
                    t.value === 'trades' ? (trades as any[]).length :
                      t.value === 'products' ? (products as any[]).length :
                        (botData as any[]).length} rows
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
