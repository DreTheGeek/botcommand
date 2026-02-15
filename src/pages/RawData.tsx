import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { properties, prospects, trades, products, fmt } from '@/data/mockData';
import { Download, Database, Activity, CheckCircle } from 'lucide-react';

const tables: Record<string, { headers: string[]; rows: string[][] }> = {
  properties: {
    headers: ['Address', 'County', 'State', 'Net Profit', 'Score', 'Status'],
    rows: properties.map((p) => [p.address, p.county, p.state, fmt.money(p.netProfit), p.dealScore.toString(), p.status]),
  },
  prospects: {
    headers: ['Company', 'Contact', 'Deal Size', 'Stage', 'Days in Stage'],
    rows: prospects.map((p) => [p.company, p.contact, fmt.money(p.dealSize), p.stage, p.daysInStage.toString()]),
  },
  trades: {
    headers: ['Date', 'Symbol', 'Strategy', 'P&L', 'Result'],
    rows: trades.map((t) => [t.date, t.symbol, t.strategy, fmt.moneyDecimal(t.pnl), t.winLoss]),
  },
  products: {
    headers: ['Name', 'Status', 'ROAS', 'Revenue Today', 'Orders'],
    rows: products.map((p) => [p.name, p.status, p.roas.toFixed(1) + 'x', fmt.money(p.revenueToday), p.ordersToday.toString()]),
  },
};

export default function RawData() {
  const [selectedTable, setSelectedTable] = useState('properties');
  const [sql, setSql] = useState('SELECT * FROM properties WHERE deal_score > 80;');
  const data = tables[selectedTable];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Raw Data</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Connection', value: 'Connected', icon: CheckCircle, color: 'text-[hsl(var(--nexus-success))]' },
          { label: 'Tables', value: Object.keys(tables).length.toString(), icon: Database, color: 'text-primary' },
          { label: 'Total Records', value: fmt.num(properties.length + prospects.length + trades.length + products.length), icon: Activity, color: 'text-[hsl(var(--nexus-info))]' },
          { label: 'Last Updated', value: '2 min ago', icon: CheckCircle, color: 'text-muted-foreground' },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`h-6 w-6 ${m.color}`} />
              <div><p className="font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedTable} onValueChange={setSelectedTable}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(tables).map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export CSV</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>{data.headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, i) => (
                <TableRow key={i}>{row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}</TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">SQL Query</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={sql} onChange={(e) => setSql(e.target.value)} className="font-mono text-sm h-24" />
          <Button size="sm">Execute Query</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
