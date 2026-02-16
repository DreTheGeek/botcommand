import { useQuery } from '@tanstack/react-query';
import { externalSupabase } from '@/lib/externalSupabase';

const REFETCH_INTERVAL = 60_000;

function useExternalTable<T = Record<string, any>>(
  table: string,
  options?: { limit?: number; orderBy?: string; ascending?: boolean; filters?: Record<string, any> }
) {
  const { limit = 100, orderBy = 'created_at', ascending = false, filters } = options || {};

  return useQuery<T[]>({
    queryKey: ['external', table, limit, orderBy, ascending, filters],
    queryFn: async () => {
      if (!externalSupabase) {
        console.warn('External Supabase client not configured (missing anon key)');
        return [];
      }
      let q = externalSupabase
        .from(table)
        .select('*')
        .order(orderBy, { ascending })
        .limit(limit);

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          q = q.eq(key, value);
        }
      }

      const { data, error } = await q;
      if (error) {
        console.warn(`External DB query failed for ${table}:`, error.message);
        return [];
      }
      return (data as T[]) || [];
    },
    refetchInterval: REFETCH_INTERVAL,
    retry: 1,
  });
}

export function useEcosystemHealth() {
  return useExternalTable('ecosystem_health');
}

export function useRevenueTracking() {
  return useExternalTable('revenue_tracking');
}

export function useSystemNotifications(limit = 20) {
  return useExternalTable('system_notifications', { limit });
}

export function useBotMessages(limit = 50) {
  return useExternalTable('bot_messages', { limit });
}

export function usePropertyDeals(limit = 100) {
  return useExternalTable('property_deals', { limit });
}

export function useDeals(limit = 100) {
  return useExternalTable('deals', { limit });
}

export function useTrades(limit = 200) {
  return useExternalTable('trades', { limit });
}

export function useOpportunities(limit = 100) {
  return useExternalTable('opportunities', { limit });
}

export function useProducts(limit = 100) {
  return useExternalTable('products', { limit });
}

export function useContentPosts(limit = 100) {
  return useExternalTable('content_posts', { limit });
}
