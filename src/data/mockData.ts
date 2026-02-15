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
  { id: 'trading', name: 'Tammy Trader', icon: 'TrendingUp', description: 'Executes day trades, swing trades, manages portfolio with strict risk limits', status: 'active', keyMetric: '+$142 today (78% win rate)', route: '/bots/trading' },
  { id: 'rhianna', name: 'Rhianna Research', icon: 'Search', description: 'Tracks trends, competitors, opportunities before anyone else sees them', status: 'attention', keyMetric: '5 opportunities detected', route: '/bots/rhianna' },
  { id: 'deondre', name: 'Deondre Dropshipping', icon: 'ShoppingBag', description: 'Tests products, manages suppliers, scales winners to $10K+/day', status: 'active', keyMetric: '2 products scaling (3.4 ROAS)', route: '/bots/deondre' },
  { id: 'carter', name: 'Carter Content', icon: 'Video', description: 'Creates viral content across YouTube, TikTok, X, Instagram, LinkedIn daily', status: 'active', keyMetric: '87K views this week', route: '/bots/carter' },
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

// ============ RONNIE REALTY DATA ============

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

// ============ ANA SALES DATA ============

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
  date: '2026-02-15',
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
  { id: 1, title: 'How I Built 6 AI Bots', platform: 'YouTube', scheduledTime: '2026-02-16 10:00', status: 'Scheduled', content: 'Full tutorial walkthrough' },
  { id: 2, title: 'Automation hack #47', platform: 'TikTok', scheduledTime: '2026-02-15 18:00', status: 'Scheduled', content: '60-sec quick tip' },
  { id: 3, title: 'Thread: AI trends 2026', platform: 'X', scheduledTime: '2026-02-15 14:00', status: 'Published', content: '12-tweet thread' },
  { id: 4, title: 'Behind the scenes', platform: 'Instagram', scheduledTime: '2026-02-16 12:00', status: 'Scheduled', content: 'Carousel post' },
  { id: 5, title: 'Sales automation case study', platform: 'LinkedIn', scheduledTime: '2026-02-17 09:00', status: 'Draft', content: 'Long-form article' },
  { id: 6, title: 'Weekly wins recap', platform: 'Facebook', scheduledTime: '2026-02-16 15:00', status: 'Scheduled', content: 'Video update' },
  { id: 7, title: 'Day in the life of AI bots', platform: 'TikTok', scheduledTime: '2026-02-17 18:00', status: 'Draft', content: 'POV video' },
  { id: 8, title: 'Dropshipping results reveal', platform: 'YouTube', scheduledTime: '2026-02-18 10:00', status: 'Draft', content: 'Revenue breakdown' },
  { id: 9, title: '3 tools you need', platform: 'Instagram', scheduledTime: '2026-02-17 12:00', status: 'Scheduled', content: 'Reel' },
  { id: 10, title: 'Hot take: AI in business', platform: 'X', scheduledTime: '2026-02-16 08:00', status: 'Scheduled', content: 'Thread' },
];

export const platformStats: PlatformStat[] = [
  { platform: 'YouTube', followers: 12400, views: 45000, engagementRate: 6.2, topPost: 'How I Built 6 AI Bots', trend: 12 },
  { platform: 'TikTok', followers: 28900, views: 187000, engagementRate: 8.5, topPost: 'Automation hack #42', trend: 24 },
  { platform: 'X', followers: 8200, views: 32000, engagementRate: 4.1, topPost: 'AI trends thread', trend: 8 },
  { platform: 'Instagram', followers: 15600, views: 67000, engagementRate: 5.8, topPost: 'Behind the scenes reel', trend: 15 },
  { platform: 'LinkedIn', followers: 4800, views: 21000, engagementRate: 7.3, topPost: 'Sales automation article', trend: 18 },
  { platform: 'Facebook', followers: 3200, views: 12000, engagementRate: 3.4, topPost: 'Weekly update video', trend: -2 },
];

export const contentLibrary: ContentLibraryItem[] = [
  { id: 1, title: 'How I Built 6 AI Bots That Make Money', platform: 'YouTube', postDate: '2026-02-10', views: 12400, engagement: 8.2 },
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
  { id: 1, title: 'Hillsborough Tax Sale', date: '2026-03-15', botId: 'ronnie', type: 'auction' },
  { id: 2, title: 'ABC Manufacturing Follow-up', date: '2026-02-16', botId: 'ana', type: 'meeting' },
  { id: 3, title: 'AAPL Earnings Report', date: '2026-02-20', botId: 'trading', type: 'event' },
  { id: 4, title: 'Competitor Report Due', date: '2026-02-17', botId: 'rhianna', type: 'deadline' },
  { id: 5, title: 'Product #47 Scale Decision', date: '2026-02-16', botId: 'deondre', type: 'decision' },
  { id: 6, title: 'YouTube Video Publish', date: '2026-02-16', botId: 'carter', type: 'content' },
  { id: 7, title: 'Fulton County Sale', date: '2026-03-20', botId: 'ronnie', type: 'auction' },
  { id: 8, title: 'TechFlow Demo', date: '2026-02-18', botId: 'ana', type: 'meeting' },
  { id: 9, title: 'Monthly P&L Review', date: '2026-02-28', botId: 'trading', type: 'review' },
  { id: 10, title: 'TikTok Content Batch', date: '2026-02-19', botId: 'carter', type: 'content' },
];

export const fmt = {
  money: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n),
  moneyDecimal: (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
  pct: (n: number) => `${n.toFixed(1)}%`,
  num: (n: number) => new Intl.NumberFormat('en-US').format(n),
  date: (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
};
