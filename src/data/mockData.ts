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
  { id: 'optimus', name: 'Optimus Prime', icon: 'Shield', description: 'Gateway coordinator — routes messages, monitors all bots, manages system health', status: 'active', keyMetric: '10/10 bots online', route: '/bots/optimus' },
  { id: 'ava', name: 'Ava Analyst', icon: 'Crown', description: 'Analytics engine — KPI tracking, reports, anomaly detection, performance dashboards', status: 'active', keyMetric: '23 KPIs tracked', route: '/bots/ava' },
  { id: 'sarah', name: 'Sarah Sales', icon: 'Briefcase', description: 'Sales pipeline — proposals, outreach, deal management, closes $25K-$85K deals', status: 'active', keyMetric: '$275K in pipeline', route: '/bots/sarah' },
  { id: 'rhianna', name: 'Rhianna Research', icon: 'Search', description: 'Market intelligence — trends, competitors, opportunities, research reports', status: 'attention', keyMetric: '5 opportunities detected', route: '/bots/rhianna' },
  { id: 'benny', name: 'Benny Builder', icon: 'Hammer', description: 'Project builder — websites, apps, automations, client deliverables', status: 'active', keyMetric: '3 projects in progress', route: '/bots/benny' },
  { id: 'randy', name: 'Randy Realty', icon: 'Home', description: 'Real estate — tax deed analysis, property deals, auction tracking across 31 states', status: 'active', keyMetric: '3 hot deals found today', route: '/bots/randy' },
  { id: 'carter', name: 'Carter Content', icon: 'Video', description: 'Content creator — YouTube, TikTok, X, Instagram, LinkedIn content automation', status: 'active', keyMetric: '87K views this week', route: '/bots/carter' },
  { id: 'cleah', name: 'Cleah Coding', icon: 'Code', description: 'Code specialist — bug fixes, feature development, code reviews, technical ops', status: 'active', keyMetric: '12 PRs merged this week', route: '/bots/cleah' },
  { id: 'tammy', name: 'Tammy Trader', icon: 'TrendingUp', description: 'Trading bot — day trades, swing trades, portfolio management, strict risk limits', status: 'active', keyMetric: '+$142 today (78% win rate)', route: '/bots/tammy' },
  { id: 'deondre', name: 'Deondre Dropshipping', icon: 'ShoppingBag', description: 'E-commerce — product testing, supplier management, ad campaigns, scaling winners', status: 'active', keyMetric: '2 products scaling (3.4 ROAS)', route: '/bots/deondre' },
];

export const notifications: Notification[] = [
  { id: 1, priority: 'urgent', botId: 'randy', message: 'Hot deal: 3BR in Tampa, FL - $62K profit potential', timeAgo: '2 minutes ago', read: false },
  { id: 2, priority: 'action', botId: 'sarah', message: 'ABC Company viewed proposal 3 times - follow up recommended', timeAgo: '15 minutes ago', read: false },
  { id: 3, priority: 'win', botId: 'tammy', message: 'NVDA swing trade closed +$89 (2.3R)', timeAgo: '1 hour ago', read: false },
  { id: 4, priority: 'info', botId: 'rhianna', message: 'New trend detected: AI automation consulting demand up 340%', timeAgo: '2 hours ago', read: true },
  { id: 5, priority: 'action', botId: 'deondre', message: 'Product #47 hit 3.8 ROAS - ready to scale', timeAgo: '3 hours ago', read: true },
  { id: 6, priority: 'win', botId: 'carter', message: 'TikTok post went viral: 45K views in 4 hours', timeAgo: '4 hours ago', read: true },
  { id: 7, priority: 'urgent', botId: 'tammy', message: 'Daily loss limit at 71% - monitor closely', timeAgo: '30 minutes ago', read: false },
  { id: 8, priority: 'info', botId: 'ava', message: 'Weekly analytics report generated - revenue up 23%', timeAgo: '5 hours ago', read: true },
  { id: 9, priority: 'win', botId: 'benny', message: 'Client portal v2 deployed successfully', timeAgo: '6 hours ago', read: true },
  { id: 10, priority: 'action', botId: 'cleah', message: '3 PRs awaiting review - 2 are high priority', timeAgo: '1 hour ago', read: false },
  { id: 11, priority: 'info', botId: 'optimus', message: 'All 10 bots healthy - daily reset completed at 4 AM', timeAgo: '8 hours ago', read: true },
];

export const revenue: Revenue = {
  today: { total: 2847, property: 0, trading: 142, sales: 0, dropshipping: 2705 },
  pipeline: 275000,
  monthChange: 23,
};

export const tasks: Task[] = [
  { id: 1, description: 'Review 3 hot property deals', botId: 'randy', priority: 'urgent', completed: false },
  { id: 2, description: 'Follow up with ABC Company proposal', botId: 'sarah', priority: 'action', completed: false },
  { id: 3, description: 'Analyze AAPL trade setup', botId: 'tammy', priority: 'action', completed: false },
  { id: 4, description: 'Research competitor XYZ move', botId: 'rhianna', priority: 'info', completed: false },
  { id: 5, description: 'Post scheduled TikTok at 6 PM', botId: 'carter', priority: 'win', completed: false },
  { id: 6, description: 'Review Cleah\'s 3 pending PRs', botId: 'cleah', priority: 'action', completed: false },
  { id: 7, description: 'Deploy client dashboard update', botId: 'benny', priority: 'action', completed: false },
];

export const quickStats = {
  activeDeals: 12,
  openPositions: 3,
  contentScheduled: 8,
  systemHealth: 'operational' as const,
};

// ============ OPTIMUS PRIME DATA ============

export interface SystemStatus {
  botId: string;
  botName: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  lastActivity: string;
  messagesHandled: number;
  avgResponseTime: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  source: string;
  message: string;
}

export const systemStatuses: SystemStatus[] = [
  { botId: 'optimus', botName: 'Optimus Prime', status: 'online', uptime: '99.9%', lastActivity: '2 min ago', messagesHandled: 1247, avgResponseTime: '1.2s' },
  { botId: 'ava', botName: 'Ava Analyst', status: 'online', uptime: '99.8%', lastActivity: '5 min ago', messagesHandled: 892, avgResponseTime: '2.1s' },
  { botId: 'sarah', botName: 'Sarah Sales', status: 'online', uptime: '99.7%', lastActivity: '12 min ago', messagesHandled: 634, avgResponseTime: '1.8s' },
  { botId: 'rhianna', botName: 'Rhianna Research', status: 'degraded', uptime: '97.2%', lastActivity: '18 min ago', messagesHandled: 428, avgResponseTime: '3.4s' },
  { botId: 'benny', botName: 'Benny Builder', status: 'online', uptime: '99.5%', lastActivity: '8 min ago', messagesHandled: 312, avgResponseTime: '2.5s' },
  { botId: 'randy', botName: 'Randy Realty', status: 'online', uptime: '99.9%', lastActivity: '3 min ago', messagesHandled: 567, avgResponseTime: '1.5s' },
  { botId: 'carter', botName: 'Carter Content', status: 'online', uptime: '99.6%', lastActivity: '15 min ago', messagesHandled: 723, avgResponseTime: '1.9s' },
  { botId: 'cleah', botName: 'Cleah Coding', status: 'online', uptime: '99.4%', lastActivity: '6 min ago', messagesHandled: 445, avgResponseTime: '2.8s' },
  { botId: 'tammy', botName: 'Tammy Trader', status: 'online', uptime: '99.8%', lastActivity: '1 min ago', messagesHandled: 1089, avgResponseTime: '0.8s' },
  { botId: 'deondre', botName: 'Deondre Dropshipping', status: 'online', uptime: '99.3%', lastActivity: '10 min ago', messagesHandled: 398, avgResponseTime: '2.2s' },
];

export const systemLogs: SystemLog[] = [
  { id: 1, timestamp: '2026-03-02 14:32:15', level: 'info', source: 'gateway', message: 'Daily session reset completed — all 10 agents refreshed' },
  { id: 2, timestamp: '2026-03-02 14:28:41', level: 'info', source: 'tammy-trader', message: 'NVDA swing trade closed +$89 — logged to trades table' },
  { id: 3, timestamp: '2026-03-02 14:15:22', level: 'warn', source: 'rhianna-research', message: 'Brave Search API rate limit approaching — throttling requests' },
  { id: 4, timestamp: '2026-03-02 13:58:10', level: 'info', source: 'sarah-sales', message: 'Proposal sent to ABC Manufacturing — $85K deal value' },
  { id: 5, timestamp: '2026-03-02 13:42:05', level: 'info', source: 'randy-realty', message: 'New hot deal detected: 1423 Oak Dr, Tampa — 95 score' },
  { id: 6, timestamp: '2026-03-02 13:30:00', level: 'info', source: 'carter-content', message: 'TikTok post published — "Automation hack #47"' },
  { id: 7, timestamp: '2026-03-02 12:45:33', level: 'error', source: 'rhianna-research', message: 'Firecrawl scrape failed for competitor-xyz.com — retrying' },
  { id: 8, timestamp: '2026-03-02 12:30:15', level: 'info', source: 'benny-builder', message: 'Client portal v2 deployed to production — all tests passing' },
  { id: 9, timestamp: '2026-03-02 12:15:00', level: 'info', source: 'cleah-coding', message: 'PR #47 merged: refactor auth middleware — 3 files changed' },
  { id: 10, timestamp: '2026-03-02 11:50:22', level: 'info', source: 'deondre-dropshipping', message: 'LED Sunset Lamp Pro hit 4.2x ROAS — scaling budget to $500/day' },
  { id: 11, timestamp: '2026-03-02 11:30:00', level: 'info', source: 'ava-analyst', message: 'Weekly report generated — revenue up 23% MoM' },
  { id: 12, timestamp: '2026-03-02 07:00:00', level: 'info', source: 'ava-analyst', message: 'Morning briefing delivered to Telegram' },
];

// ============ AVA ANALYST DATA ============

export interface KpiSnapshot {
  id: number;
  name: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  change: string;
}

export interface AnalyticsReport {
  id: number;
  title: string;
  type: string;
  date: string;
  summary: string;
  status: 'delivered' | 'draft' | 'scheduled';
}

export interface Anomaly {
  id: number;
  metric: string;
  expected: string;
  actual: string;
  deviation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected: string;
}

export const kpiSnapshots: KpiSnapshot[] = [
  { id: 1, name: 'Monthly Revenue', value: '$54,847', target: '$200,000', trend: 'up', category: 'Revenue', change: '+23%' },
  { id: 2, name: 'Pipeline Value', value: '$275,000', target: '$500,000', trend: 'up', category: 'Sales', change: '+15%' },
  { id: 3, name: 'Win Rate', value: '31%', target: '25%', trend: 'up', category: 'Sales', change: '+4%' },
  { id: 4, name: 'Trading P&L (MTD)', value: '+$2,847', target: '+$5,000', trend: 'up', category: 'Trading', change: '+18%' },
  { id: 5, name: 'Trading Win Rate', value: '78%', target: '55%', trend: 'up', category: 'Trading', change: '+3%' },
  { id: 6, name: 'E-Commerce Revenue', value: '$52,000', target: '$60,000', trend: 'up', category: 'E-Commerce', change: '+8%' },
  { id: 7, name: 'ROAS (Avg)', value: '3.4x', target: '3.0x', trend: 'up', category: 'E-Commerce', change: '+0.3x' },
  { id: 8, name: 'Content Engagement', value: '6.8%', target: '5.0%', trend: 'up', category: 'Content', change: '+1.2%' },
  { id: 9, name: 'Hot Property Deals', value: '4', target: '3', trend: 'up', category: 'Real Estate', change: '+1' },
  { id: 10, name: 'Response Time', value: '1.8s', target: '3.0s', trend: 'down', category: 'System', change: '-0.4s' },
  { id: 11, name: 'Bot Uptime', value: '99.6%', target: '99.0%', trend: 'stable', category: 'System', change: '+0.1%' },
  { id: 12, name: 'Active Prospects', value: '8', target: '10', trend: 'up', category: 'Sales', change: '+2' },
];

export const analyticsReports: AnalyticsReport[] = [
  { id: 1, title: 'Weekly Performance Report', type: 'Weekly', date: '2026-03-02', summary: 'Revenue up 23% MoM. Pipeline healthy at $275K. 2 products scaling. 78% trading win rate.', status: 'delivered' },
  { id: 2, title: 'Monthly Revenue Analysis', type: 'Monthly', date: '2026-02-28', summary: 'Feb total: $54,847. Dropshipping led at $52K. Trading contributed $2.8K. Sales pipeline growing.', status: 'delivered' },
  { id: 3, title: 'Competitor Movement Report', type: 'Ad-hoc', date: '2026-02-27', summary: 'AutomateHQ launched free tier. FlowBot Pro changed pricing. 3 new entrants identified.', status: 'delivered' },
  { id: 4, title: 'Q1 2026 Forecast', type: 'Quarterly', date: '2026-03-05', summary: 'Projected Q1 revenue: $180K-$220K. Key driver: e-commerce scaling + 2 enterprise deals closing.', status: 'scheduled' },
  { id: 5, title: 'Daily Morning Briefing', type: 'Daily', date: '2026-03-02', summary: '3 hot deals, 1 proposal viewed 3x, TikTok viral post. Trading P&L +$142 today.', status: 'delivered' },
];

export const anomalies: Anomaly[] = [
  { id: 1, metric: 'Daily Trading Loss', expected: '<$100', actual: '$142', deviation: '+42%', severity: 'medium', detected: '30 min ago' },
  { id: 2, metric: 'Rhianna Response Time', expected: '<2.0s', actual: '3.4s', deviation: '+70%', severity: 'high', detected: '18 min ago' },
  { id: 3, metric: 'TikTok Views Spike', expected: '~5K/day', actual: '45K in 4hrs', deviation: '+800%', severity: 'low', detected: '4 hours ago' },
  { id: 4, metric: 'Email Open Rate Drop', expected: '35%', actual: '22%', deviation: '-37%', severity: 'medium', detected: '2 hours ago' },
];

// ============ BENNY BUILDER DATA ============

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'On Hold';
  progress: number;
  deadline: string;
  tech: string[];
  value: number;
}

export interface Deployment {
  id: number;
  project: string;
  environment: string;
  status: 'success' | 'failed' | 'deploying';
  timestamp: string;
  version: string;
}

export const projects: Project[] = [
  { id: 1, name: 'HVAC Client Portal v2', client: 'City Wide HVAC', status: 'In Progress', progress: 78, deadline: '2026-03-15', tech: ['React', 'Supabase', 'Tailwind'], value: 15000 },
  { id: 2, name: 'AI Voice Agent Setup', client: 'Metro Plumbing', status: 'In Progress', progress: 45, deadline: '2026-03-22', tech: ['Vapi', 'Node.js', 'Twilio'], value: 8500 },
  { id: 3, name: 'CRM Automation System', client: 'Premier Electric', status: 'Planning', progress: 10, deadline: '2026-04-01', tech: ['n8n', 'Supabase', 'Resend'], value: 12000 },
  { id: 4, name: 'Kaldr Tech Website Redesign', client: 'Internal', status: 'In Progress', progress: 62, deadline: '2026-03-10', tech: ['Next.js', 'Framer Motion', 'Vercel'], value: 0 },
  { id: 5, name: 'E-commerce Storefront', client: 'Sunset Lamps Co', status: 'Completed', progress: 100, deadline: '2026-02-20', tech: ['Shopify', 'Liquid', 'Custom Theme'], value: 5500 },
  { id: 6, name: 'Booking System Integration', client: 'FastFix AC', status: 'On Hold', progress: 30, deadline: '2026-04-15', tech: ['Cal.com', 'Zapier', 'ServiceTitan'], value: 6000 },
];

export const deployments: Deployment[] = [
  { id: 1, project: 'HVAC Client Portal v2', environment: 'Production', status: 'success', timestamp: '2026-03-02 12:30', version: 'v2.4.1' },
  { id: 2, project: 'Kaldr Tech Website', environment: 'Staging', status: 'success', timestamp: '2026-03-02 10:15', version: 'v3.1.0-beta' },
  { id: 3, project: 'AI Voice Agent', environment: 'Development', status: 'deploying', timestamp: '2026-03-02 14:00', version: 'v1.2.0' },
  { id: 4, project: 'CRM Automation', environment: 'Development', status: 'success', timestamp: '2026-03-01 16:45', version: 'v0.3.0' },
  { id: 5, project: 'E-commerce Storefront', environment: 'Production', status: 'success', timestamp: '2026-02-20 09:00', version: 'v1.0.0' },
  { id: 6, project: 'HVAC Client Portal v2', environment: 'Staging', status: 'failed', timestamp: '2026-03-01 11:20', version: 'v2.4.0' },
];

// ============ CLEAH CODING DATA ============

export interface PullRequest {
  id: number;
  title: string;
  repo: string;
  status: 'open' | 'merged' | 'closed';
  author: string;
  reviewers: string[];
  filesChanged: number;
  additions: number;
  deletions: number;
  created: string;
}

export interface BugReport {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  repo: string;
  reported: string;
  assignee: string;
}

export interface CodeMetric {
  name: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export const pullRequests: PullRequest[] = [
  { id: 47, title: 'Refactor auth middleware for JWT validation', repo: 'theavengers', status: 'merged', author: 'cleah', reviewers: ['benny'], filesChanged: 3, additions: 142, deletions: 87, created: '2026-03-02' },
  { id: 48, title: 'Add rate limiting to API endpoints', repo: 'theavengers', status: 'open', author: 'cleah', reviewers: ['benny'], filesChanged: 5, additions: 210, deletions: 15, created: '2026-03-02' },
  { id: 49, title: 'Fix Supabase connection pool exhaustion', repo: 'theavengers', status: 'open', author: 'cleah', reviewers: [], filesChanged: 2, additions: 38, deletions: 12, created: '2026-03-01' },
  { id: 50, title: 'Implement webhook retry with exponential backoff', repo: 'theavengers', status: 'open', author: 'cleah', reviewers: ['benny'], filesChanged: 4, additions: 186, deletions: 42, created: '2026-03-01' },
  { id: 45, title: 'Add TypeScript strict mode to all modules', repo: 'botcommand', status: 'merged', author: 'cleah', reviewers: ['benny'], filesChanged: 12, additions: 89, deletions: 34, created: '2026-02-28' },
  { id: 44, title: 'Optimize Supabase query batching', repo: 'theavengers', status: 'merged', author: 'cleah', reviewers: ['benny'], filesChanged: 6, additions: 245, deletions: 178, created: '2026-02-27' },
  { id: 43, title: 'Fix memory leak in conversation history', repo: 'theavengers', status: 'merged', author: 'cleah', reviewers: [], filesChanged: 1, additions: 22, deletions: 8, created: '2026-02-26' },
  { id: 42, title: 'Add error boundary components', repo: 'botcommand', status: 'merged', author: 'cleah', reviewers: ['benny'], filesChanged: 4, additions: 156, deletions: 0, created: '2026-02-25' },
];

export const bugReports: BugReport[] = [
  { id: 1, title: 'Context window overflow crashing Ava', severity: 'critical', status: 'resolved', repo: 'theavengers', reported: '2026-03-02', assignee: 'cleah' },
  { id: 2, title: 'Rate limiter blocks legitimate requests', severity: 'high', status: 'in-progress', repo: 'theavengers', reported: '2026-03-01', assignee: 'cleah' },
  { id: 3, title: 'Dashboard loading slow on mobile', severity: 'medium', status: 'open', repo: 'botcommand', reported: '2026-02-28', assignee: 'cleah' },
  { id: 4, title: 'Stale cache on pipeline queries', severity: 'low', status: 'open', repo: 'theavengers', reported: '2026-02-27', assignee: 'benny' },
  { id: 5, title: 'Telegram webhook timeout on large messages', severity: 'high', status: 'resolved', repo: 'theavengers', reported: '2026-02-25', assignee: 'cleah' },
];

export const codeMetrics: CodeMetric[] = [
  { name: 'PRs Merged (This Week)', value: '12', trend: 'up', description: 'Up from 8 last week' },
  { name: 'Open Issues', value: '4', trend: 'down', description: 'Down from 7 last week' },
  { name: 'Test Coverage', value: '84%', trend: 'up', description: 'Target: 80%' },
  { name: 'Build Success Rate', value: '96%', trend: 'stable', description: '1 failed deploy this week' },
  { name: 'Avg PR Review Time', value: '2.4 hrs', trend: 'down', description: 'Down from 4.1 hrs' },
  { name: 'Lines Changed', value: '1,847', trend: 'up', description: 'Across 8 PRs' },
];

// ============ RANDY REALTY DATA ============

export interface Property {
  id: number;
  address: string;
  county: string;
  state: string;
  saleDate: string;
  minBid: number;
  arv: number;
  netProfit: number;
  dealScore: number;
  status: 'Hot Deal' | 'Warm' | 'Watching' | 'Passed';
  beds: number;
  baths: number;
  sqft: number;
  repairs: number;
}

export interface Purchase {
  id: number;
  address: string;
  purchasePrice: number;
  repairs: number;
  soldPrice: number | null;
  actualProfit: number | null;
  status: 'Owned' | 'Renovating' | 'Listed' | 'Sold';
  purchaseDate: string;
}

export const properties: Property[] = [
  { id: 1, address: '1423 Oak Dr, Tampa', county: 'Hillsborough', state: 'FL', saleDate: '2026-03-15', minBid: 18000, arv: 185000, netProfit: 62000, dealScore: 95, status: 'Hot Deal', beds: 3, baths: 2, sqft: 1450, repairs: 45000 },
  { id: 2, address: '892 Pine St, Atlanta', county: 'Fulton', state: 'GA', saleDate: '2026-03-20', minBid: 12000, arv: 140000, netProfit: 48000, dealScore: 88, status: 'Hot Deal', beds: 2, baths: 1, sqft: 1100, repairs: 35000 },
  { id: 3, address: '3301 Elm Ave, Phoenix', county: 'Maricopa', state: 'AZ', saleDate: '2026-04-01', minBid: 25000, arv: 220000, netProfit: 71000, dealScore: 92, status: 'Hot Deal', beds: 4, baths: 2, sqft: 1800, repairs: 55000 },
  { id: 4, address: '567 Maple Ln, Dallas', county: 'Dallas', state: 'TX', saleDate: '2026-03-25', minBid: 15000, arv: 160000, netProfit: 42000, dealScore: 78, status: 'Warm', beds: 3, baths: 2, sqft: 1350, repairs: 48000 },
  { id: 5, address: '2100 Cedar Ct, Orlando', county: 'Orange', state: 'FL', saleDate: '2026-04-10', minBid: 22000, arv: 195000, netProfit: 55000, dealScore: 85, status: 'Warm', beds: 3, baths: 2, sqft: 1500, repairs: 50000 },
  { id: 6, address: '445 Birch Rd, Memphis', county: 'Shelby', state: 'TN', saleDate: '2026-03-18', minBid: 8000, arv: 95000, netProfit: 28000, dealScore: 72, status: 'Watching', beds: 2, baths: 1, sqft: 950, repairs: 30000 },
  { id: 7, address: '1800 Walnut Blvd, Charlotte', county: 'Mecklenburg', state: 'NC', saleDate: '2026-04-05', minBid: 30000, arv: 250000, netProfit: 78000, dealScore: 91, status: 'Hot Deal', beds: 4, baths: 3, sqft: 2100, repairs: 60000 },
  { id: 8, address: '623 Spruce Way, Jacksonville', county: 'Duval', state: 'FL', saleDate: '2026-03-28', minBid: 14000, arv: 130000, netProfit: 38000, dealScore: 75, status: 'Warm', beds: 3, baths: 1, sqft: 1200, repairs: 40000 },
  { id: 9, address: '990 Ash Dr, Houston', county: 'Harris', state: 'TX', saleDate: '2026-04-15', minBid: 20000, arv: 175000, netProfit: 52000, dealScore: 82, status: 'Watching', beds: 3, baths: 2, sqft: 1400, repairs: 45000 },
  { id: 10, address: '112 Poplar St, Detroit', county: 'Wayne', state: 'MI', saleDate: '2026-03-12', minBid: 5000, arv: 65000, netProfit: 18000, dealScore: 60, status: 'Passed', beds: 2, baths: 1, sqft: 850, repairs: 25000 },
];

export const purchases: Purchase[] = [
  { id: 1, address: '234 River Rd, Tampa, FL', purchasePrice: 16500, repairs: 42000, soldPrice: 178000, actualProfit: 58500, status: 'Sold', purchaseDate: '2025-09-10' },
  { id: 2, address: '891 Lake Ave, Orlando, FL', purchasePrice: 21000, repairs: 38000, soldPrice: null, actualProfit: null, status: 'Renovating', purchaseDate: '2025-12-05' },
  { id: 3, address: '456 Hill St, Atlanta, GA', purchasePrice: 12000, repairs: 35000, soldPrice: 155000, actualProfit: 49000, status: 'Sold', purchaseDate: '2025-08-20' },
  { id: 4, address: '789 Valley Dr, Charlotte, NC', purchasePrice: 28000, repairs: 0, soldPrice: null, actualProfit: null, status: 'Owned', purchaseDate: '2026-01-15' },
];

// ============ SARAH SALES DATA ============

export interface Prospect {
  id: number;
  company: string;
  contact: string;
  dealSize: number;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiating' | 'Won' | 'Lost';
  daysInStage: number;
  nextAction: string;
  painPoints: string;
}

export interface Proposal {
  id: number;
  company: string;
  sentDate: string;
  dealSize: number;
  status: 'Sent' | 'Viewed' | 'Accepted' | 'Rejected';
  engagementScore: number;
  views: number;
}

export interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting';
  prospect: string;
  subject: string;
  date: string;
  outcome: string;
}

export const prospects: Prospect[] = [
  { id: 1, company: 'ABC Manufacturing', contact: 'John Smith', dealSize: 85000, stage: 'Negotiating', daysInStage: 3, nextAction: 'Send revised pricing', painPoints: 'Outdated CRM, manual reporting' },
  { id: 2, company: 'TechFlow Inc', contact: 'Sarah Chen', dealSize: 45000, stage: 'Proposal', daysInStage: 5, nextAction: 'Follow up on proposal', painPoints: 'Slow lead response time' },
  { id: 3, company: 'Global Logistics', contact: 'Mike Torres', dealSize: 62000, stage: 'Qualified', daysInStage: 2, nextAction: 'Schedule demo', painPoints: 'Supply chain visibility' },
  { id: 4, company: 'Premier Health', contact: 'Lisa Wang', dealSize: 38000, stage: 'Lead', daysInStage: 1, nextAction: 'Initial outreach call', painPoints: 'Patient scheduling chaos' },
  { id: 5, company: 'DataVault Corp', contact: 'James Lee', dealSize: 72000, stage: 'Won', daysInStage: 0, nextAction: 'Onboarding kickoff', painPoints: 'Data migration complexity' },
  { id: 6, company: 'Bright Solar', contact: 'Amy Ross', dealSize: 55000, stage: 'Proposal', daysInStage: 8, nextAction: 'Address objections', painPoints: 'Installation scheduling' },
  { id: 7, company: 'Metro Retail', contact: 'Dan Kim', dealSize: 25000, stage: 'Lead', daysInStage: 4, nextAction: 'Qualify budget', painPoints: 'Inventory management' },
  { id: 8, company: 'Swift Delivery', contact: 'Rachel Green', dealSize: 41000, stage: 'Lost', daysInStage: 0, nextAction: 'Post-mortem review', painPoints: 'Route optimization' },
];

export const proposals: Proposal[] = [
  { id: 1, company: 'ABC Manufacturing', sentDate: '2026-02-10', dealSize: 85000, status: 'Viewed', engagementScore: 9, views: 7 },
  { id: 2, company: 'TechFlow Inc', sentDate: '2026-02-08', dealSize: 45000, status: 'Viewed', engagementScore: 6, views: 3 },
  { id: 3, company: 'Bright Solar', sentDate: '2026-02-05', dealSize: 55000, status: 'Sent', engagementScore: 2, views: 1 },
  { id: 4, company: 'DataVault Corp', sentDate: '2026-01-28', dealSize: 72000, status: 'Accepted', engagementScore: 10, views: 12 },
  { id: 5, company: 'Swift Delivery', sentDate: '2026-01-20', dealSize: 41000, status: 'Rejected', engagementScore: 4, views: 2 },
];

export const activities: Activity[] = [
  { id: 1, type: 'call', prospect: 'ABC Manufacturing', subject: 'Pricing discussion', date: '2026-02-15', outcome: 'Requested revised quote' },
  { id: 2, type: 'email', prospect: 'TechFlow Inc', subject: 'Proposal follow-up', date: '2026-02-14', outcome: 'Opened, no reply yet' },
  { id: 3, type: 'meeting', prospect: 'Global Logistics', subject: 'Discovery call', date: '2026-02-13', outcome: 'Qualified - strong fit' },
  { id: 4, type: 'call', prospect: 'Premier Health', subject: 'Cold outreach', date: '2026-02-13', outcome: 'Left voicemail' },
  { id: 5, type: 'email', prospect: 'Bright Solar', subject: 'Case study share', date: '2026-02-12', outcome: 'Clicked link' },
  { id: 6, type: 'meeting', prospect: 'DataVault Corp', subject: 'Contract signing', date: '2026-02-11', outcome: 'Deal closed!' },
  { id: 7, type: 'call', prospect: 'Metro Retail', subject: 'Intro call', date: '2026-02-10', outcome: 'Interested, needs budget approval' },
  { id: 8, type: 'email', prospect: 'Swift Delivery', subject: 'Follow-up', date: '2026-02-09', outcome: 'No response' },
  { id: 9, type: 'meeting', prospect: 'ABC Manufacturing', subject: 'Demo presentation', date: '2026-02-08', outcome: 'Very positive feedback' },
  { id: 10, type: 'call', prospect: 'TechFlow Inc', subject: 'Needs assessment', date: '2026-02-07', outcome: 'Identified 3 pain points' },
];

// ============ TAMMY TRADER DATA ============

export interface Trade {
  id: number;
  date: string;
  symbol: string;
  strategy: 'Day Trade' | 'Swing' | 'Long-term';
  entry: number;
  exit: number;
  pnl: number;
  winLoss: 'W' | 'L';
  shares: number;
  confidence: number;
}

export interface OpenPosition {
  id: number;
  symbol: string;
  strategy: 'Day Trade' | 'Swing' | 'Long-term';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  stopLoss: number;
  takeProfit: number;
  holdTime: string;
}

export interface Strategy {
  name: string;
  trades: number;
  winRate: number;
  avgProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  status: 'Active' | 'Paused';
}

export interface RiskData {
  dailyLossUsed: number;
  dailyLossLimit: number;
  positionCount: number;
  positionLimit: number;
  tradeCount: number;
  tradeLimit: number;
  buyingPower: number;
}

export const trades: Trade[] = [
  { id: 1, date: '2026-02-15', symbol: 'NVDA', strategy: 'Swing', entry: 142.50, exit: 145.80, pnl: 89, winLoss: 'W', shares: 27, confidence: 85 },
  { id: 2, date: '2026-02-15', symbol: 'AAPL', strategy: 'Day Trade', entry: 198.20, exit: 199.10, pnl: 53, winLoss: 'W', shares: 59, confidence: 72 },
  { id: 3, date: '2026-02-14', symbol: 'TSLA', strategy: 'Day Trade', entry: 245.00, exit: 243.50, pnl: -42, winLoss: 'L', shares: 28, confidence: 65 },
  { id: 4, date: '2026-02-14', symbol: 'META', strategy: 'Swing', entry: 520.00, exit: 528.50, pnl: 127, winLoss: 'W', shares: 15, confidence: 88 },
  { id: 5, date: '2026-02-13', symbol: 'AMZN', strategy: 'Day Trade', entry: 185.60, exit: 186.90, pnl: 65, winLoss: 'W', shares: 50, confidence: 78 },
  { id: 6, date: '2026-02-13', symbol: 'MSFT', strategy: 'Day Trade', entry: 415.00, exit: 413.80, pnl: -36, winLoss: 'L', shares: 30, confidence: 60 },
  { id: 7, date: '2026-02-12', symbol: 'GOOGL', strategy: 'Swing', entry: 175.20, exit: 178.40, pnl: 96, winLoss: 'W', shares: 30, confidence: 82 },
  { id: 8, date: '2026-02-12', symbol: 'AMD', strategy: 'Day Trade', entry: 165.50, exit: 167.20, pnl: 68, winLoss: 'W', shares: 40, confidence: 75 },
  { id: 9, date: '2026-02-11', symbol: 'SPY', strategy: 'Day Trade', entry: 502.30, exit: 501.80, pnl: -25, winLoss: 'L', shares: 50, confidence: 55 },
  { id: 10, date: '2026-02-11', symbol: 'QQQ', strategy: 'Swing', entry: 435.00, exit: 438.50, pnl: 105, winLoss: 'W', shares: 30, confidence: 80 },
  { id: 11, date: '2026-02-10', symbol: 'NVDA', strategy: 'Day Trade', entry: 140.00, exit: 141.80, pnl: 72, winLoss: 'W', shares: 40, confidence: 77 },
  { id: 12, date: '2026-02-10', symbol: 'TSLA', strategy: 'Day Trade', entry: 248.00, exit: 249.50, pnl: 45, winLoss: 'W', shares: 30, confidence: 70 },
  { id: 13, date: '2026-02-09', symbol: 'AAPL', strategy: 'Swing', entry: 195.00, exit: 198.20, pnl: 128, winLoss: 'W', shares: 40, confidence: 85 },
  { id: 14, date: '2026-02-09', symbol: 'META', strategy: 'Day Trade', entry: 518.00, exit: 516.50, pnl: -30, winLoss: 'L', shares: 20, confidence: 58 },
  { id: 15, date: '2026-02-08', symbol: 'AMZN', strategy: 'Day Trade', entry: 183.00, exit: 184.60, pnl: 80, winLoss: 'W', shares: 50, confidence: 82 },
];

export const openPositions: OpenPosition[] = [
  { id: 1, symbol: 'AAPL', strategy: 'Swing', shares: 40, entryPrice: 198.20, currentPrice: 199.80, pnl: 64, stopLoss: 196.00, takeProfit: 205.00, holdTime: '2d' },
  { id: 2, symbol: 'GOOGL', strategy: 'Long-term', shares: 20, entryPrice: 172.50, currentPrice: 178.40, pnl: 118, stopLoss: 165.00, takeProfit: 195.00, holdTime: '12d' },
  { id: 3, symbol: 'MSFT', strategy: 'Swing', shares: 15, entryPrice: 412.00, currentPrice: 415.50, pnl: 52.50, stopLoss: 405.00, takeProfit: 425.00, holdTime: '3d' },
];

export const strategies: Strategy[] = [
  { name: 'Day Trading', trades: 89, winRate: 72, avgProfit: 48, maxDrawdown: -180, sharpeRatio: 1.8, status: 'Active' },
  { name: 'Swing Trading', trades: 34, winRate: 82, avgProfit: 95, maxDrawdown: -120, sharpeRatio: 2.3, status: 'Active' },
  { name: 'Long-term', trades: 8, winRate: 88, avgProfit: 340, maxDrawdown: -85, sharpeRatio: 2.8, status: 'Active' },
];

export const riskData: RiskData = {
  dailyLossUsed: 142,
  dailyLossLimit: 200,
  positionCount: 3,
  positionLimit: 5,
  tradeCount: 7,
  tradeLimit: 15,
  buyingPower: 12500,
};

// ============ RHIANNA RESEARCH DATA ============

export interface DailyBrief {
  date: string;
  topInsights: string[];
  opportunities: string[];
  threats: string[];
  contentOpportunities: string[];
  recommendedActions: string[];
}

export interface Opportunity {
  id: number;
  problem: string;
  source: string;
  businessType: string;
  dealSize: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

export interface Competitor {
  id: number;
  name: string;
  industry: string;
  threatLevel: number;
  lastActivity: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Trend {
  id: number;
  name: string;
  category: string;
  score: number;
  stage: 'Emerging' | 'Growing' | 'Mainstream';
  monetizationPotential: string;
  signals: string[];
}

export interface ContentIdea {
  id: number;
  topic: string;
  platform: string;
  whyPerformWell: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export const dailyBrief: DailyBrief = {
  date: '2026-03-02',
  topInsights: [
    'AI automation consulting demand surged 340% in the last 30 days based on Google Trends data',
    'Three competitors launched new pricing tiers this week targeting mid-market',
    'Reddit r/smallbusiness showing increased interest in automated workflows',
  ],
  opportunities: [
    'Local HVAC companies need CRM automation - 12 posts found on Reddit this week',
    'E-commerce brands seeking AI-powered customer service solutions',
    'Real estate agencies looking for automated lead scoring tools',
  ],
  threats: [
    'Competitor XYZ launched a free tier that directly competes with our entry offering',
    'New regulatory framework being discussed for AI-generated content in marketing',
  ],
  contentOpportunities: [
    '"How I automated my entire sales pipeline" - trending topic format on LinkedIn',
    'AI tool comparison videos getting 3x normal engagement on YouTube',
  ],
  recommendedActions: [
    'Prioritize outreach to HVAC companies - highest conversion potential',
    'Create counter-positioning content against Competitor XYZ free tier',
    'Schedule LinkedIn post about automation case study by Wednesday',
  ],
};

export const opportunities: Opportunity[] = [
  { id: 1, problem: 'HVAC companies need automated scheduling and CRM', source: 'Reddit r/smallbusiness', businessType: 'Service Business', dealSize: '$25K-$45K', tier: 'Gold' },
  { id: 2, problem: 'E-commerce brands overwhelmed by customer support tickets', source: 'Twitter/X monitoring', businessType: 'E-commerce', dealSize: '$35K-$60K', tier: 'Gold' },
  { id: 3, problem: 'Law firms need document automation for contracts', source: 'LinkedIn scanning', businessType: 'Professional Services', dealSize: '$50K-$85K', tier: 'Silver' },
  { id: 4, problem: 'Restaurants need inventory management automation', source: 'Google Trends spike', businessType: 'Food & Beverage', dealSize: '$15K-$25K', tier: 'Bronze' },
  { id: 5, problem: 'Real estate agencies need lead scoring AI', source: 'Reddit r/realestate', businessType: 'Real Estate', dealSize: '$30K-$55K', tier: 'Silver' },
  { id: 6, problem: 'Fitness studios need automated member engagement', source: 'Facebook Groups', businessType: 'Health & Fitness', dealSize: '$20K-$35K', tier: 'Bronze' },
];

export const competitors: Competitor[] = [
  { id: 1, name: 'AutomateHQ', industry: 'Business Automation', threatLevel: 8, lastActivity: 'Launched free tier Feb 12', strengths: ['Strong brand', 'VC funded', 'Large team'], weaknesses: ['Slow support', 'Complex onboarding', 'No customization'] },
  { id: 2, name: 'FlowBot Pro', industry: 'AI Chatbots', threatLevel: 6, lastActivity: 'New pricing Feb 10', strengths: ['Good UI', 'Fast setup'], weaknesses: ['Limited integrations', 'No analytics'] },
  { id: 3, name: 'ScaleAI Solutions', industry: 'AI Consulting', threatLevel: 7, lastActivity: 'Hired 5 sales reps', strengths: ['Enterprise focus', 'Custom solutions'], weaknesses: ['Expensive', 'Slow delivery'] },
  { id: 4, name: 'QuickServe AI', industry: 'Customer Service AI', threatLevel: 5, lastActivity: 'Blog post on automation', strengths: ['Niche focus', 'Good reviews'], weaknesses: ['Small team', 'Limited scalability'] },
];

export const trends: Trend[] = [
  { id: 1, name: 'AI Automation Consulting', category: 'Services', score: 94, stage: 'Growing', monetizationPotential: '$50K-$100K/client', signals: ['340% search increase', '12 Reddit threads/week', 'LinkedIn trending'] },
  { id: 2, name: 'Voice AI Assistants', category: 'Technology', score: 78, stage: 'Emerging', monetizationPotential: '$25K-$60K/client', signals: ['OpenAI voice API launch', 'Enterprise adoption growing'] },
  { id: 3, name: 'Automated Content Repurposing', category: 'Content', score: 85, stage: 'Growing', monetizationPotential: '$15K-$35K/client', signals: ['Creator economy growth', 'Multi-platform demand'] },
  { id: 4, name: 'AI-Powered Sales Outreach', category: 'Sales', score: 72, stage: 'Mainstream', monetizationPotential: '$20K-$45K/client', signals: ['High competition', 'Commoditizing'] },
  { id: 5, name: 'Predictive Analytics for SMBs', category: 'Analytics', score: 68, stage: 'Emerging', monetizationPotential: '$30K-$70K/client', signals: ['Data literacy improving', 'Tool costs dropping'] },
];

export const contentIdeas: ContentIdea[] = [
  { id: 1, topic: 'How I Automated My Entire Sales Pipeline in 48 Hours', platform: 'LinkedIn', whyPerformWell: 'Automation case studies get 3x engagement', urgency: 'High' },
  { id: 2, topic: 'AI Tools Comparison: Which One Actually Works?', platform: 'YouTube', whyPerformWell: 'Comparison videos trending in tech', urgency: 'High' },
  { id: 3, topic: '5 Signs Your Business Needs AI Automation', platform: 'TikTok', whyPerformWell: 'Listicle format performs well on short-form', urgency: 'Medium' },
  { id: 4, topic: 'The Hidden Cost of Manual Processes', platform: 'X', whyPerformWell: 'Pain-point threads get high shares', urgency: 'Low' },
];

// ============ DEONDRE DROPSHIPPING DATA ============

export interface Product {
  id: number;
  name: string;
  status: 'Testing' | 'Scaling' | 'Killed';
  roas: number;
  revenueToday: number;
  ordersToday: number;
  adSpend: number;
  aov: number;
  conversionRate: number;
}

export interface Campaign {
  id: number;
  product: string;
  platform: 'Facebook' | 'TikTok' | 'Google';
  budget: number;
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  status: 'Active' | 'Paused';
}

export interface Supplier {
  id: number;
  name: string;
  platform: string;
  rating: number;
  avgShipTime: number;
  productsSupplied: number;
  issues: number;
}

export const products: Product[] = [
  { id: 1, name: 'LED Sunset Lamp Pro', status: 'Scaling', roas: 4.2, revenueToday: 1850, ordersToday: 47, adSpend: 440, aov: 39.36, conversionRate: 3.8 },
  { id: 2, name: 'Posture Corrector X', status: 'Scaling', roas: 3.1, revenueToday: 855, ordersToday: 28, adSpend: 276, aov: 30.54, conversionRate: 2.9 },
  { id: 3, name: 'Smart Water Bottle', status: 'Testing', roas: 1.8, revenueToday: 220, ordersToday: 8, adSpend: 122, aov: 27.50, conversionRate: 1.5 },
  { id: 4, name: 'Magnetic Phone Mount', status: 'Testing', roas: 2.4, revenueToday: 380, ordersToday: 15, adSpend: 158, aov: 25.33, conversionRate: 2.1 },
  { id: 5, name: 'Wireless Earbuds V3', status: 'Killed', roas: 0.8, revenueToday: 0, ordersToday: 0, adSpend: 0, aov: 44.99, conversionRate: 0.6 },
  { id: 6, name: 'Mini Projector HD', status: 'Testing', roas: 2.1, revenueToday: 490, ordersToday: 5, adSpend: 233, aov: 98.00, conversionRate: 1.2 },
];

export const campaigns: Campaign[] = [
  { id: 1, product: 'LED Sunset Lamp Pro', platform: 'TikTok', budget: 500, spend: 320, revenue: 1344, roas: 4.2, ctr: 3.8, status: 'Active' },
  { id: 2, product: 'LED Sunset Lamp Pro', platform: 'Facebook', budget: 300, spend: 120, revenue: 506, roas: 4.2, ctr: 2.9, status: 'Active' },
  { id: 3, product: 'Posture Corrector X', platform: 'Facebook', budget: 350, spend: 276, revenue: 855, roas: 3.1, ctr: 2.4, status: 'Active' },
  { id: 4, product: 'Smart Water Bottle', platform: 'TikTok', budget: 200, spend: 122, revenue: 220, roas: 1.8, ctr: 1.9, status: 'Active' },
];

export const suppliers: Supplier[] = [
  { id: 1, name: 'ShenZhen Direct', platform: 'AliExpress', rating: 4.7, avgShipTime: 8, productsSupplied: 3, issues: 0 },
  { id: 2, name: 'GuangZhou Wholesale', platform: 'CJDropshipping', rating: 4.3, avgShipTime: 12, productsSupplied: 2, issues: 1 },
  { id: 3, name: 'US Fulfillment Co', platform: 'Zendrop', rating: 4.9, avgShipTime: 3, productsSupplied: 1, issues: 0 },
];

// ============ CARTER CONTENT DATA ============

export interface ScheduledContent {
  id: number;
  title: string;
  platform: 'YouTube' | 'TikTok' | 'X' | 'Instagram' | 'LinkedIn' | 'Facebook';
  scheduledTime: string;
  status: 'Scheduled' | 'Published' | 'Draft';
  content: string;
}

export interface PlatformStat {
  platform: string;
  followers: number;
  views: number;
  engagementRate: number;
  topPost: string;
  trend: number;
}

export interface ContentLibraryItem {
  id: number;
  title: string;
  platform: string;
  postDate: string;
  views: number;
  engagement: number;
}

export const scheduledContent: ScheduledContent[] = [
  { id: 1, title: 'How I Built 10 AI Bots', platform: 'YouTube', scheduledTime: '2026-03-03 10:00', status: 'Scheduled', content: 'Full tutorial walkthrough' },
  { id: 2, title: 'Automation hack #47', platform: 'TikTok', scheduledTime: '2026-03-02 18:00', status: 'Scheduled', content: '60-sec quick tip' },
  { id: 3, title: 'Thread: AI trends 2026', platform: 'X', scheduledTime: '2026-03-02 14:00', status: 'Published', content: '12-tweet thread' },
  { id: 4, title: 'Behind the scenes', platform: 'Instagram', scheduledTime: '2026-03-03 12:00', status: 'Scheduled', content: 'Carousel post' },
  { id: 5, title: 'Sales automation case study', platform: 'LinkedIn', scheduledTime: '2026-03-04 09:00', status: 'Draft', content: 'Long-form article' },
  { id: 6, title: 'Weekly wins recap', platform: 'Facebook', scheduledTime: '2026-03-03 15:00', status: 'Scheduled', content: 'Video update' },
  { id: 7, title: 'Day in the life of AI bots', platform: 'TikTok', scheduledTime: '2026-03-04 18:00', status: 'Draft', content: 'POV video' },
  { id: 8, title: 'Dropshipping results reveal', platform: 'YouTube', scheduledTime: '2026-03-05 10:00', status: 'Draft', content: 'Revenue breakdown' },
  { id: 9, title: '3 tools you need', platform: 'Instagram', scheduledTime: '2026-03-04 12:00', status: 'Scheduled', content: 'Reel' },
  { id: 10, title: 'Hot take: AI in business', platform: 'X', scheduledTime: '2026-03-03 08:00', status: 'Scheduled', content: 'Thread' },
];

export const platformStats: PlatformStat[] = [
  { platform: 'YouTube', followers: 12400, views: 45000, engagementRate: 6.2, topPost: 'How I Built 10 AI Bots', trend: 12 },
  { platform: 'TikTok', followers: 28900, views: 187000, engagementRate: 8.5, topPost: 'Automation hack #42', trend: 24 },
  { platform: 'X', followers: 8200, views: 32000, engagementRate: 4.1, topPost: 'AI trends thread', trend: 8 },
  { platform: 'Instagram', followers: 15600, views: 67000, engagementRate: 5.8, topPost: 'Behind the scenes reel', trend: 15 },
  { platform: 'LinkedIn', followers: 4800, views: 21000, engagementRate: 7.3, topPost: 'Sales automation article', trend: 18 },
  { platform: 'Facebook', followers: 3200, views: 12000, engagementRate: 3.4, topPost: 'Weekly update video', trend: -2 },
];

export const contentLibrary: ContentLibraryItem[] = [
  { id: 1, title: 'How I Built 10 AI Bots That Make Money', platform: 'YouTube', postDate: '2026-02-10', views: 12400, engagement: 8.2 },
  { id: 2, title: 'This automation hack saved me 20 hours', platform: 'TikTok', postDate: '2026-02-09', views: 45000, engagement: 12.1 },
  { id: 3, title: 'AI Trends Thread 2026', platform: 'X', postDate: '2026-02-08', views: 8900, engagement: 5.4 },
  { id: 4, title: 'Day in the Life: AI Entrepreneur', platform: 'Instagram', postDate: '2026-02-07', views: 15200, engagement: 7.8 },
  { id: 5, title: 'Why I Replaced My Sales Team with AI', platform: 'LinkedIn', postDate: '2026-02-06', views: 6800, engagement: 9.1 },
  { id: 6, title: 'Dropshipping with AI: Real Numbers', platform: 'YouTube', postDate: '2026-02-04', views: 8900, engagement: 6.5 },
  { id: 7, title: 'Quick tip: Auto-respond to leads', platform: 'TikTok', postDate: '2026-02-03', views: 32000, engagement: 10.3 },
  { id: 8, title: 'My AI stack revealed', platform: 'X', postDate: '2026-02-01', views: 5400, engagement: 4.2 },
];

// ============ HUB DATA ============

export const monthlyRevenue = [
  { month: 'Sep', property: 58500, trading: 2800, sales: 72000, dropshipping: 18000 },
  { month: 'Oct', property: 0, trading: 3200, sales: 45000, dropshipping: 24000 },
  { month: 'Nov', property: 49000, trading: 2100, sales: 38000, dropshipping: 31000 },
  { month: 'Dec', property: 0, trading: 4500, sales: 62000, dropshipping: 42000 },
  { month: 'Jan', property: 0, trading: 3800, sales: 55000, dropshipping: 48000 },
  { month: 'Feb', property: 0, trading: 2847, sales: 0, dropshipping: 52000 },
];

export const calendarEvents = [
  { id: 1, title: 'Hillsborough Tax Sale', date: '2026-03-15', botId: 'randy', type: 'auction' },
  { id: 2, title: 'ABC Manufacturing Follow-up', date: '2026-03-03', botId: 'sarah', type: 'meeting' },
  { id: 3, title: 'AAPL Earnings Report', date: '2026-03-20', botId: 'tammy', type: 'event' },
  { id: 4, title: 'Competitor Report Due', date: '2026-03-04', botId: 'rhianna', type: 'deadline' },
  { id: 5, title: 'Product #47 Scale Decision', date: '2026-03-03', botId: 'deondre', type: 'decision' },
  { id: 6, title: 'YouTube Video Publish', date: '2026-03-03', botId: 'carter', type: 'content' },
  { id: 7, title: 'Fulton County Sale', date: '2026-03-20', botId: 'randy', type: 'auction' },
  { id: 8, title: 'TechFlow Demo', date: '2026-03-05', botId: 'sarah', type: 'meeting' },
  { id: 9, title: 'Monthly P&L Review', date: '2026-03-28', botId: 'tammy', type: 'review' },
  { id: 10, title: 'TikTok Content Batch', date: '2026-03-06', botId: 'carter', type: 'content' },
  { id: 11, title: 'Deploy Portal v2', date: '2026-03-15', botId: 'benny', type: 'deadline' },
  { id: 12, title: 'Code Review Sprint', date: '2026-03-04', botId: 'cleah', type: 'deadline' },
];

export const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  moneyDecimal: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
  pct: (n: number) => `${n.toFixed(1)}%`,
  num: (n: number) => new Intl.NumberFormat('en-US').format(n),
  date: (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
};
