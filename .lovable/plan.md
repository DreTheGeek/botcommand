

# Build All Bot Deep Dives, Hub Pages, and Fix Bot Names

This is a large build covering 18+ new files: 6 bot pages, 6 hub/system pages, expanded mock data, shared layout component, and routing updates.

---

## 1. Fix Bot Names (2 files)

**`src/data/mockData.ts`**
- "Trading Bot" -> "Tammy Trader"
- "Deondre" -> "Deondre Dropshipping"
- "Carter" -> "Carter Content"

**`src/components/layout/AppSidebar.tsx`**
- "Ana Sales" -> "Ana Sales Analyst"
- "Trading Bot" -> "Tammy Trader"
- "Deondre" -> "Deondre Dropshipping"
- "Carter" -> "Carter Content"

---

## 2. Expand Mock Data (`src/data/mockData.ts`)

Add typed interfaces and arrays for every bot's domain data:

- **Ronnie**: properties (10 items with address, county, state, saleDate, minBid, arv, netProfit, dealScore, status, beds, baths, sqft), purchases (4 items with status tracking)
- **Ana**: prospects (8 items with pipeline stages), proposals (5 items with engagement), activities (10 items: calls/emails/meetings)
- **Tammy**: trades (15 historical), openPositions (3), strategies (3: Day/Swing/Long-term), riskData (gauges)
- **Rhianna**: dailyBrief (expandable sections), opportunities (6), competitors (4 with threat levels), trends (5 with stages), contentIdeas (4)
- **Deondre**: products (6 with ROAS), campaigns (4), suppliers (3 with ratings)
- **Carter**: scheduledContent (10 posts), platformStats (6 platforms), contentLibrary (8 items)
- **Revenue Hub**: monthlyRevenue (6 months), revenueTargets
- **Calendar**: calendarEvents (combined from all bots)

---

## 3. Shared Bot Page Layout

**New file: `src/components/bots/BotPageLayout.tsx`**
- Reusable wrapper accepting bot ID, tab definitions, and children
- Header with bot icon, name, description, status indicator
- Shadcn Tabs component for tab navigation
- Framer Motion page entrance animation
- Consistent card styling matching dashboard

---

## 4. Six Bot Deep Dive Pages

### Ronnie Realty (`src/pages/bots/RonnieRealty.tsx`)
6 tabs: Overview | Deal Pipeline | Calendar | Analytics | My Purchases | Settings
- Overview: 4 metric cards + simplified SVG US map with color-coded state dots
- Deal Pipeline: Sortable data table with color-coded profit rows, click-to-expand Dialog with property details, CSV export button
- Calendar: Monthly calendar with tax sale dates as colored dots
- Analytics: Recharts line chart (deals over time), bar chart (profit by county), metrics grid
- My Purchases: Table with status badges (Owned/Renovating/Listed/Sold)
- Settings: Form fields for deal criteria, county management, bot pause/resume Switch

### Ana Sales Analyst (`src/pages/bots/AnaSales.tsx`)
5 tabs: Pipeline | Proposals | Activity | Analytics | Settings
- Pipeline: Kanban-style board with 5 columns (Lead/Qualified/Proposal/Negotiating/Won-Lost), cards with deal info, click for prospect Dialog
- Proposals: Table with engagement scores, status badges
- Activity: Timeline with icons (phone/mail/calendar), filterable
- Analytics: Recharts funnel-style bar chart, revenue chart, deal size pie chart, metric cards
- Settings: Bot controls with Switch components

### Tammy Trader (`src/pages/bots/TradingBot.tsx`)
6 tabs: Dashboard | Open Positions | Trade History | Strategies | Risk Monitor | Settings
- Dashboard: Large P&L with period tabs (Today/Week/Month), Recharts balance line chart, stats cards
- Open Positions: Table with green/red P&L coloring
- Trade History: Full searchable trade log, CSV export
- Strategies: Comparison table for 3 strategies
- Risk Monitor: 3 CSS circular gauges (daily loss, positions, trades), buying power, warning banner
- Settings: Risk parameters display, pause/resume, paper trading toggle

### Rhianna Research (`src/pages/bots/RhiannaResearch.tsx`)
6 tabs: Today's Brief | Opportunities | Competitors | Trends | Content Ideas | Settings
- Brief: Accordion sections (Insights, Opportunities, Threats, Content, Actions)
- Opportunities: Card grid with tier badges, "Send to Ana" button with toast
- Competitors: Cards with threat level progress bar (1-10)
- Trends: Cards with stage badges (Emerging/Growing/Mainstream), scores
- Content Ideas: Topic cards with platform icons, "Send to Carter" button
- Settings: Source config, scan frequency, bot controls

### Deondre Dropshipping (`src/pages/bots/DeondreDropshipping.tsx`)
5 tabs: Products | Performance | Ad Campaigns | Suppliers | Settings
- Products: 3-col card grid with status badges, ROAS coloring, click for details Dialog with Recharts chart
- Performance: Revenue summary with period tabs, table with Kill/Scale buttons
- Ad Campaigns: Campaign table with platform, budget, ROAS columns
- Suppliers: Cards with star ratings, ship time, issues count
- Settings: ROAS thresholds, bot controls

### Carter Content (`src/pages/bots/CarterContent.tsx`)
5 tabs: Calendar | Performance | Platform Stats | Content Library | Settings
- Calendar: Weekly/monthly grid with platform-color-coded posts
- Performance: Weekly overview cards, Recharts platform bar chart, top posts grid
- Platform Stats: 6 cards (YouTube/TikTok/X/Instagram/LinkedIn/Facebook) with metrics, trend arrows
- Content Library: Searchable grid with platform icons, performance metrics
- Settings: Posting schedule, content pillars, bot controls

---

## 5. Hub and System Pages

### Revenue Hub (`src/pages/RevenueHub.tsx`)
- Recharts pie chart (revenue by source), monthly bar chart (6 months)
- Pipeline cards, revenue trend line chart
- Monthly target tracker with Progress component

### Calendar Page (`src/pages/CalendarPage.tsx`)
- Monthly calendar with all bot events color-coded
- Filter checkboxes per bot, event detail on click

### Analytics Hub (`src/pages/AnalyticsHub.tsx`)
- Cross-bot performance table, revenue attribution bar chart
- Date range selector, export button

### Search Page (`src/pages/SearchPage.tsx`)
- Full search with categorized results (Properties/Prospects/Trades/Content/Products)

### Raw Data Page (`src/pages/RawData.tsx`)
- Table selector dropdown, data grid with sort/filter
- CSV export, SQL query textarea, database health cards

### Settings Page (`src/pages/SettingsPage.tsx`)
- System monitoring, notification config, display settings
- Bot config links, emergency stop, user profile

---

## 6. Routing (`src/App.tsx`)

Add all 12 routes:

```text
/               -> Index
/revenue        -> RevenueHub
/calendar       -> CalendarPage
/analytics      -> AnalyticsHub
/search         -> SearchPage
/data           -> RawData
/settings       -> SettingsPage
/bots/ronnie    -> RonnieRealty
/bots/ana       -> AnaSales
/bots/trading   -> TradingBot
/bots/rhianna   -> RhiannaResearch
/bots/deondre   -> DeondreDropshipping
/bots/carter    -> CarterContent
```

---

## Technical Notes

- All charts use Recharts (already installed)
- All UI uses existing Shadcn components (Tabs, Table, Card, Dialog, Badge, Progress, Switch, Accordion, Select, Checkbox)
- Framer Motion for page transitions and card animations
- Money formatting: `$XX,XXX` with Intl.NumberFormat
- Percentages to 1 decimal, dates as `MMM DD, YYYY`
- No new dependencies needed
- Dark mode compatible using existing CSS custom properties
- Responsive grids: 3-col on desktop, 2-col on tablet, 1-col on mobile

