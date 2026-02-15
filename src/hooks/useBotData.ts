import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BotDataEntry {
  id: string;
  user_id: string;
  bot_id: string;
  category: string;
  data: Record<string, any>;
  source_message_id: string | null;
  created_at: string;
}

interface UseBotDataOptions {
  botId?: string;
  category?: string;
  categories?: string[];
  limit?: number;
}

export function useBotData(options: UseBotDataOptions = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { botId, category, categories, limit = 100 } = options;

  const queryKey = ['bot-data', botId, category, categories?.join(','), limit];

  const query = useQuery<BotDataEntry[]>({
    queryKey,
    queryFn: async () => {
      let q = supabase
        .from('bot_data_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (botId) q = q.eq('bot_id', botId);
      if (category) q = q.eq('category', category);
      if (categories && categories.length > 0) q = q.in('category', categories);

      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as BotDataEntry[]) || [];
    },
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`bot-data-${botId || 'all'}-${category || 'all'}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bot_data_entries' },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, botId, category, queryClient]);

  return query;
}

// Helper to aggregate entries into different shapes
export function aggregateRevenue(entries: BotDataEntry[]) {
  let property = 0, trading = 0, sales = 0, dropshipping = 0;

  for (const entry of entries) {
    const amount = Number(entry.data?.amount || entry.data?.pnl || entry.data?.revenue || entry.data?.profit || 0);
    if (entry.bot_id === 'ronnie') property += amount;
    else if (['tammy', 'trading'].includes(entry.bot_id)) trading += amount;
    else if (entry.bot_id === 'ana') sales += amount;
    else if (entry.bot_id === 'deondre') dropshipping += amount;
  }

  return { property, trading, sales, dropshipping, total: property + trading + sales + dropshipping };
}

export function latestAlerts(entries: BotDataEntry[]) {
  return entries
    .filter((e) => e.category === 'alert')
    .slice(0, 10)
    .map((e) => ({
      id: e.id,
      priority: e.data?.severity || 'info',
      botId: e.bot_id,
      message: e.data?.message || JSON.stringify(e.data),
      timeAgo: formatTimeAgo(e.created_at),
    }));
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
