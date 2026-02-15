import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { monthlyRevenue, revenue, fmt } from '@/data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--nexus-success))', 'hsl(var(--nexus-warning))'];
const pieData = [
  { name: 'Property', value: 58500 },
  { name: 'Trading', value: 19247 },
  { name: 'Sales', value: 272000 },
  { name: 'Dropshipping', value: 215000 },
];
const monthlyTarget = 50000;

export default function RevenueHub() {
  const totalRevenue = pieData.reduce((s, p) => s + p.value, 0);
  const currentMonthRevenue = revenue.today.total;
  const daysInMonth = 28;
  const dayOfMonth = 15;
  const projected = (currentMonthRevenue / dayOfMonth) * daysInMonth;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold">Revenue Hub</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: fmt.money(revenue.today.total) },
          { label: 'Pipeline Value', value: fmt.money(revenue.pipeline) },
          { label: 'Month Change', value: `+${revenue.monthChange}%` },
          { label: 'Projected Monthly', value: fmt.money(projected) },
        ].map((m) => (
          <Card key={m.label}><CardContent className="p-4"><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Source (All-Time)</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => fmt.money(v)} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Revenue Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip formatter={(v: number) => fmt.money(v)} /><Legend /><Bar dataKey="property" stackId="a" fill={COLORS[0]} /><Bar dataKey="trading" stackId="a" fill={COLORS[1]} /><Bar dataKey="sales" stackId="a" fill={COLORS[2]} /><Bar dataKey="dropshipping" stackId="a" fill={COLORS[3]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Monthly Target Progress</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Current: {fmt.money(currentMonthRevenue)}</span>
            <span>Target: {fmt.money(monthlyTarget)}</span>
          </div>
          <Progress value={(currentMonthRevenue / monthlyTarget) * 100} />
          <p className="text-xs text-muted-foreground">{fmt.pct((currentMonthRevenue / monthlyTarget) * 100)} of monthly target</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue.map((m) => ({ month: m.month, total: m.property + m.trading + m.sales + m.dropshipping }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" /><YAxis stroke="hsl(var(--muted-foreground))" /><Tooltip formatter={(v: number) => fmt.money(v)} /><Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
