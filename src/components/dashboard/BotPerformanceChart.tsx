import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useBotData } from '@/hooks/useBotData';
import { usePropertyDeals, useDeals, useTrades, useOpportunities, useProducts, useContentPosts } from '@/hooks/useExternalData';

const BOT_CHART = [
  { id: 'ronnie', name: 'Ronnie', route: '/bots/ronnie', color: 'hsl(217, 91%, 60%)', extHook: 'property_deals' },
  { id: 'ana', name: 'Ana', route: '/bots/ana', color: 'hsl(259, 97%, 76%)', extHook: 'deals' },
  { id: 'tammy', name: 'Tammy', route: '/bots/trading', color: 'hsl(160, 84%, 39%)', extHook: 'trades' },
  { id: 'rhianna', name: 'Rhianna', route: '/bots/rhianna', color: 'hsl(38, 92%, 50%)', extHook: 'opportunities' },
  { id: 'deondre', name: 'Deondre', route: '/bots/deondre', color: 'hsl(38, 92%, 50%)', extHook: 'products' },
  { id: 'carter', name: 'Carter', route: '/bots/carter', color: 'hsl(189, 100%, 50%)', extHook: 'content_posts' },
];

export function BotPerformanceChart() {
  const navigate = useNavigate();
  const { data: entries } = useBotData({ limit: 200 });
  const { data: extPropertyDeals } = usePropertyDeals(100);
  const { data: extDeals } = useDeals(100);
  const { data: extTrades } = useTrades(200);
  const { data: extOpportunities } = useOpportunities(100);
  const { data: extProducts } = useProducts(100);
  const { data: extContentPosts } = useContentPosts(100);

  const extCounts: Record<string, number> = {
    property_deals: (extPropertyDeals || []).length,
    deals: (extDeals || []).length,
    trades: (extTrades || []).length,
    opportunities: (extOpportunities || []).length,
    products: (extProducts || []).length,
    content_posts: (extContentPosts || []).length,
  };

  const performanceData = BOT_CHART.map((bot) => {
    const internalCount = (entries || []).filter((e) => e.bot_id === bot.id).length;
    const extCount = extCounts[bot.extHook] || 0;
    return { ...bot, value: extCount || internalCount };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <Card className="bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Bot Data Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215, 20%, 55%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 20%, 55%)" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 30%, 17%)', border: '1px solid hsl(222, 30%, 24%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)' }} />
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
