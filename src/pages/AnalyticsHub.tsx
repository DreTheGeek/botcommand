import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { bots, fmt } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const botPerformance = [
  { name: 'Ronnie Realty', revenue: 107500, status: 'active', metric: '12 deals found' },
  { name: 'Ana Sales Analyst', revenue: 272000, status: 'active', metric: '$275K pipeline' },
  { name: 'Tammy Trader', revenue: 19247, status: 'active', metric: '78% win rate' },
  { name: 'Rhianna Research', revenue: 0, status: 'attention', metric: '5 opportunities' },
  { name: 'Deondre Dropshipping', revenue: 215000, status: 'active', metric: '3.4x ROAS' },
  { name: 'Carter Content', revenue: 0, status: 'active', metric: '87K views/week' },
];

export default function AnalyticsHub() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Hub</h1>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export Report</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Revenue Attribution by Bot</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={botPerformance.filter((b) => b.revenue > 0)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={140} fontSize={12} />
              <Tooltip formatter={(v: number) => fmt.money(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cross-Bot Performance</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Bot</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead>Key Metric</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {botPerformance.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === 'active' ? 'default' : 'secondary'} className="capitalize">{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{fmt.money(b.revenue)}</TableCell>
                  <TableCell className="text-muted-foreground">{b.metric}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
