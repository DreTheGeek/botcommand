import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const performanceData = [
  { name: 'Ronnie', value: 3, route: '/bots/ronnie', color: 'hsl(217, 91%, 60%)' },
  { name: 'Ana', value: 275, route: '/bots/ana', color: 'hsl(259, 97%, 76%)' },
  { name: 'Tammy', value: 142, route: '/bots/trading', color: 'hsl(160, 84%, 39%)' },
  { name: 'Rhianna', value: 5, route: '/bots/rhianna', color: 'hsl(38, 92%, 50%)' },
  { name: 'Deondre', value: 3.4, route: '/bots/deondre', color: 'hsl(38, 92%, 50%)' },
  { name: 'Carter', value: 87, route: '/bots/carter', color: 'hsl(189, 100%, 50%)' },
];

export function BotPerformanceChart() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Bot Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215, 20%, 55%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 20%, 55%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 30%, 17%)',
                  border: '1px solid hsl(222, 30%, 24%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 96%)',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer" onClick={(data) => navigate(data.route)}>
                {performanceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">Click any bar to view bot details</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
