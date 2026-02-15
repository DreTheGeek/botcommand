export type BotStatus = 'active' | 'attention' | 'error';
export type Priority = 'urgent' | 'action' | 'win' | 'info';

export interface Bot {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: BotStatus;
  keyMetric: string;
  route: string;
}

export interface Notification {
  id: number;
  priority: Priority;
  botId: string;
  message: string;
  timeAgo: string;
  read: boolean;
}

export interface Revenue {
  today: { total: number; property: number; trading: number; sales: number; dropshipping: number };
  pipeline: number;
  monthChange: number;
}

export interface Task {
  id: number;
  description: string;
  botId: string;
  priority: Priority;
  completed: boolean;
}

export const bots: Bot[] = [
  { id: 'ronnie', name: 'Ronnie Realty', icon: 'Home', description: 'Finds $40K+ profit tax deed properties across 31 states', status: 'active', keyMetric: '3 hot deals found today', route: '/bots/ronnie' },
  { id: 'ana', name: 'Ana Sales Analyst', icon: 'Briefcase', description: 'Generates proposals, business plans, closes $25K-$85K deals', status: 'active', keyMetric: '$275K in pipeline', route: '/bots/ana' },
  { id: 'trading', name: 'Trading Bot', icon: 'TrendingUp', description: 'Executes day trades, swing trades, manages portfolio with strict risk limits', status: 'active', keyMetric: '+$142 today (78% win rate)', route: '/bots/trading' },
  { id: 'rhianna', name: 'Rhianna Research', icon: 'Search', description: 'Tracks trends, competitors, opportunities before anyone else sees them', status: 'attention', keyMetric: '5 opportunities detected', route: '/bots/rhianna' },
  { id: 'deondre', name: 'Deondre', icon: 'ShoppingBag', description: 'Tests products, manages suppliers, scales winners to $10K+/day', status: 'active', keyMetric: '2 products scaling (3.4 ROAS)', route: '/bots/deondre' },
  { id: 'carter', name: 'Carter', icon: 'Video', description: 'Creates viral content across YouTube, TikTok, X, Instagram, LinkedIn daily', status: 'active', keyMetric: '87K views this week', route: '/bots/carter' },
];

export const notifications: Notification[] = [
  { id: 1, priority: 'urgent', botId: 'ronnie', message: 'Hot deal: 3BR in Tampa, FL - $62K profit potential', timeAgo: '2 minutes ago', read: false },
  { id: 2, priority: 'action', botId: 'ana', message: 'ABC Company viewed proposal 3 times - follow up recommended', timeAgo: '15 minutes ago', read: false },
  { id: 3, priority: 'win', botId: 'trading', message: 'NVDA swing trade closed +$89 (2.3R)', timeAgo: '1 hour ago', read: false },
  { id: 4, priority: 'info', botId: 'rhianna', message: 'New trend detected: AI automation consulting demand up 340%', timeAgo: '2 hours ago', read: true },
  { id: 5, priority: 'action', botId: 'deondre', message: 'Product #47 hit 3.8 ROAS - ready to scale', timeAgo: '3 hours ago', read: true },
  { id: 6, priority: 'win', botId: 'carter', message: 'TikTok post went viral: 45K views in 4 hours', timeAgo: '4 hours ago', read: true },
  { id: 7, priority: 'urgent', botId: 'trading', message: 'Daily loss limit at 71% - monitor closely', timeAgo: '30 minutes ago', read: false },
  { id: 8, priority: 'info', botId: 'carter', message: 'Weekly content report ready for review', timeAgo: '5 hours ago', read: true },
];

export const revenue: Revenue = {
  today: { total: 2847, property: 0, trading: 142, sales: 0, dropshipping: 2705 },
  pipeline: 275000,
  monthChange: 23,
};

export const tasks: Task[] = [
  { id: 1, description: 'Review 3 hot property deals', botId: 'ronnie', priority: 'urgent', completed: false },
  { id: 2, description: 'Follow up with ABC Company proposal', botId: 'ana', priority: 'action', completed: false },
  { id: 3, description: 'Analyze AAPL trade setup', botId: 'trading', priority: 'action', completed: false },
  { id: 4, description: 'Research competitor XYZ move', botId: 'rhianna', priority: 'info', completed: false },
  { id: 5, description: 'Post scheduled TikTok at 6 PM', botId: 'carter', priority: 'win', completed: false },
];

export const quickStats = {
  activeDeals: 12,
  openPositions: 3,
  contentScheduled: 8,
  systemHealth: 'operational' as const,
};
