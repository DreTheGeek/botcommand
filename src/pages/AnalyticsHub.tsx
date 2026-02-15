import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBotData } from '@/hooks/useBotData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BOT_NAMES: Record<string, string> = {
  ronnie: 'Ronnie Realty',
  ana: 'Ana Sales',
  tammy: 'Tammy Trader',
  rhianna: 'Rhianna Research',
  deondre: 'Deondre Dropshipping',
  carter: 'Carter Content',
};

export default function AnalyticsHub() {
  const { data: entries } = useBotData({ limit: 500 });

  const botCounts = Object.entries(BOT_NAMES).map(([id, name]) => ({
    name,
    entries: (entries || []).filter((e) => e.bot_id === id).length,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Analytics Hub</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Data Entries by Bot</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={botCounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={140} fontSize={12} />
              <Tooltip />
              <Bar dataKey="entries" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Data Entries</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Bot</TableHead><TableHead>Category</TableHead><TableHead>Time</TableHead><TableHead>Data Preview</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {(entries || []).length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No data yet. Bot messages will be analyzed and structured data will appear here.</TableCell></TableRow>}
              {(entries || []).slice(0, 20).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{BOT_NAMES[e.bot_id] || e.bot_id}</TableCell>
                  <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">{JSON.stringify(e.data)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
