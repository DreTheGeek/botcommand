
# Restore Premium CRM Bot Pages

All the rich mock data already exists in `src/data/mockData.ts` -- properties, purchases, prospects, proposals, trades, open positions, strategies, risk data, competitors, trends, content schedules, platform stats, and more. The current bot pages only use 2-3 basic tabs each. This plan restores the full detailed sub-tab experience shown in your screenshots while keeping all working external database hooks.

## What Changes

### 1. Ronnie Realty (`src/pages/bots/RonnieRealty.tsx`) -- Full Rewrite
**Tabs**: Overview, Deal Pipeline, Calendar, Analytics, My Purchases, Settings

- **Overview**: 4 stat cards with icons (Hot Deals, Total Profit Potential, Upcoming Sales, States Covered) + Active States section showing state badges with deal counts (e.g., "FL (3 deals)")
- **Deal Pipeline**: Full data table with columns: Address, County, State, Sale Date, Min Bid, Net Profit, Score (colored circle badges), Status (colored badges: Hot Deal=green, Warm=cyan, Watching=outline, Passed=outline) + Export CSV button
- **Calendar**: Upcoming tax sale dates from mock data
- **Analytics**: Summary stats from the deals data
- **My Purchases**: Table with Address, Purchase Price, Repairs, Sold Price, Profit (green text), Status (Sold=red badge, Renovating=outline, Owned=cyan badge)
- **Settings**: Two cards side-by-side -- "Deal Criteria" (Min Profit Threshold $40,000, Max Purchase Price $50,000, Property Types SFH/Duplex, Min Deal Score 60) and "Bot Controls" (Bot Active toggle, States Monitored: 31, Counties Tracked: 247)

Data sources: External `usePropertyDeals()` for live data with fallback to `properties` and `purchases` from mockData.

### 2. Ana Sales (`src/pages/bots/AnaSales.tsx`) -- Full Rewrite
**Tabs**: Pipeline, Proposals, Activity Log, Analytics, Settings

- **Pipeline**: Summary stats (Total Pipeline, Active Deals, Avg Deal Size, Win Rate) + full table with Company, Contact, Deal Size, Stage (colored badges), Days in Stage, Next Action
- **Proposals**: Table with Company, Sent Date, Deal Size, Status, Engagement Score, Views
- **Activity Log**: Table with Type (icon badges for call/email/meeting), Prospect, Subject, Date, Outcome
- **Settings**: Bot configuration cards

Data sources: External `useDeals()` with fallback to `prospects`, `proposals`, `activities` from mockData.

### 3. Tammy Trader (`src/pages/bots/TradingBot.tsx`) -- Full Rewrite
**Tabs**: Dashboard, Open Positions, Trade History, Strategies, Risk Monitor, Settings

- **Dashboard**: 4 stat cards (Total P&L, Win Rate, Total Trades, Avg Profit) 
- **Open Positions**: Table with Symbol, Strategy, Shares, Entry Price, Current Price, P&L, Stop Loss, Take Profit, Hold Time
- **Trade History**: Full table with Date, Symbol, Strategy, Entry, Exit, P&L (green/red), Result badge, Shares, Confidence
- **Strategies**: Cards showing strategy name, trades count, win rate, avg profit, max drawdown, Sharpe ratio, status
- **Risk Monitor**: Warning banner ("One or more risk limits approaching threshold") + 3 progress bar cards (Daily Loss 142/200 71%, Positions 3/5 60%, Trades Today 7/15 46.7%) with colored bars + Buying Power card showing $12,500
- **Settings**: Trading configuration

Data sources: External `useTrades()` with fallback to `trades`, `openPositions`, `strategies`, `riskData` from mockData.

### 4. Rhianna Research (`src/pages/bots/RhiannaResearch.tsx`) -- Full Rewrite
**Tabs**: Today's Brief, Opportunities, Competitors, Trends, Content Ideas, Settings

- **Today's Brief**: "Daily Intelligence Brief -- Feb 14, 2026" card with accordion/collapsible sections: Top Insights (3), Opportunities (3), Threats (2), Content Opportunities (2), Recommended Actions (3) -- each with bullet lists and teal icons
- **Opportunities**: Table/cards showing problem, source, business type, deal size, tier (Gold/Silver/Bronze badges)
- **Competitors**: Grid of cards -- each with company name, industry badge, Threat Level progress bar (red/orange/yellow based on level, e.g., 8/10), last activity text, two-column Strengths (green) / Weaknesses (red) bullet lists
- **Trends**: Cards with trend name, category, score, stage badge, monetization potential, signal bullets
- **Content Ideas**: Table with topic, platform, why it will perform well, urgency badge
- **Settings**: Research configuration

Data sources: External `useOpportunities()` with fallback to `dailyBrief`, `opportunities`, `competitors`, `trends`, `contentIdeas` from mockData.

### 5. Deondre Dropshipping (`src/pages/bots/DeondreDropshipping.tsx`) -- Full Rewrite
**Tabs**: Products, Performance, Ad Campaigns, Suppliers, Settings

- **Products**: Grid of product cards -- each showing product name, status badge (Scaling=cyan, Testing=gray, Killed=outline), large colored ROAS number (green if good, red if bad), Revenue, Orders, Ad Spend, CVR in a 2x2 grid layout
- **Performance**: 4 stat cards (Total Revenue, Total Ad Spend, Net Profit, Blended ROAS) + table with Product, Status, Revenue, ROAS (colored), Actions column with "Scale" and "Kill" buttons
- **Ad Campaigns**: Table with Product, Platform, Budget, Spend, Revenue, ROAS, CTR, Status
- **Suppliers**: Table/cards with Name, Platform, Rating, Avg Ship Time, Products Supplied, Issues
- **Settings**: Dropshipping configuration

Data sources: External `useProducts()` with fallback to `products`, `campaigns`, `suppliers` from mockData.

### 6. Carter Content (`src/pages/bots/CarterContent.tsx`) -- Full Rewrite
**Tabs**: Calendar, Performance, Platform Stats, Content Library, Settings

- **Calendar**: Full table with Title, Platform (colored badges -- YouTube=red, TikTok=cyan, X=gray, Instagram=outline, LinkedIn=blue, Facebook=blue), Scheduled datetime, Status (Scheduled=cyan, Published=outline, Draft=outline), Content description
- **Performance**: Aggregate stats from platform data (Total Views, Total Followers, Avg Engagement)
- **Platform Stats**: Cards per platform showing followers, views, engagement rate, top post, trend percentage
- **Content Library**: Table with Title, Platform, Post Date, Views, Engagement %
- **Settings**: Content configuration

Data sources: External `useContentPosts()` and `useContentPerformance()` with fallback to `scheduledContent`, `platformStats`, `contentLibrary` from mockData.

## What Stays the Same

- All external data hooks in `src/hooks/useExternalData.ts` (untouched)
- The `BotPageLayout` component (reused for all pages -- provides the header with icon, name, status badge, description, and tab navigation)
- The `src/data/mockData.ts` file (already has all the data)
- Dashboard bot cards and their external data metrics
- All routing, authentication, sidebar navigation
- The dark theme with navy/black gradients and teal/purple accents

## Technical Details

### Files to modify (6 bot page files):
- `src/pages/bots/RonnieRealty.tsx` -- from ~114 lines to ~350 lines
- `src/pages/bots/AnaSales.tsx` -- from ~70 lines to ~300 lines
- `src/pages/bots/TradingBot.tsx` -- from ~100 lines to ~400 lines
- `src/pages/bots/RhiannaResearch.tsx` -- from ~60 lines to ~350 lines
- `src/pages/bots/DeondreDropshipping.tsx` -- from ~70 lines to ~350 lines
- `src/pages/bots/CarterContent.tsx` -- from ~60 lines to ~350 lines

### Data strategy per tab:
Each tab will first check for external database data. If external data exists, it displays that. If not, it falls back to the rich mock data from `mockData.ts`. This means the pages look fully populated immediately (with mock data) and seamlessly switch to real data as the external database gets populated.

### UI components used:
- Existing: Card, Badge, Table, Tabs, Progress (from Radix/shadcn)
- Accordion/Collapsible (already installed) for Rhianna's Daily Brief sections
- Switch (already installed) for Settings toggles
- No new dependencies needed

### Settings tabs:
Each bot gets a Settings tab with static configuration cards showing bot-specific parameters and a "Bot Active" toggle switch -- matching the Ronnie Settings screenshot pattern.
