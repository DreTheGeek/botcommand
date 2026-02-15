

# NEXUS - LaSean's Bot Empire Control Center

## Phase 1: Foundation & Main Dashboard
Set up the core design system, layout, and main dashboard page.

### Design System & Theme
- Dark mode default with custom color palette (deep navy/black gradients, electric teal & cyber purple accents)
- Light mode toggle with theme context
- Custom fonts: Inter for UI, JetBrains Mono for data
- Animated gradient background with subtle particle effect
- Alert color system (red/yellow/green/blue)

### Layout Shell
- Top navigation bar with NEXUS logo, global search bar, notification bell with badge, theme toggle, and profile dropdown
- Collapsible sidebar with all 13 navigation items (main sections + bot deep dives)
- Smooth collapse/expand animation, icons-only when collapsed

### Main Dashboard (Landing Page)
- **Bot Status Grid**: 6 cards (2x3 grid) showing each bot's name, icon, description, status dot, key metric, and "View Details" button
- **Revenue Dashboard**: Today's total revenue with breakdown by source (Property, Trading, Sales, Dropshipping), pipeline total, month-to-date comparison
- **Alert Center**: Notification panel with filter tabs (All/Urgent/Action/Wins), latest 5 alerts with colored dots, bot icons, timestamps
- **Quick Stats Bar**: 4 metric cards (Active Deals, Open Positions, Content Scheduled, System Health)
- **Today's Focus**: Priority checklist with 5 action items, checkboxes, bot icons, urgency indicators

### Global Features
- Notification dropdown from bell icon with filters, mark-all-read, scrollable list
- Global search with categorized real-time results (Properties, Prospects, Trades, Content, Products)
- Auto-refresh every 60 seconds with "Updated X seconds ago" indicator
- Mock data layer structured to match future Supabase schema

---

## Phase 2: Bot Deep Dive Pages (Part 1)

### Ronnie Realty - Property Bot
- **Overview tab**: 4 metric cards + interactive US map with color-coded property markers and click-to-view details
- **Deal Pipeline tab**: Sortable/filterable data table with color-coded rows, click-to-expand modal with full property analysis, pagination, CSV export
- **Calendar tab**: Monthly view with tax sale dates highlighted, click date for details, county filter
- **Analytics tab**: Line chart (deals over time), bar chart (profit by county), histogram (deal scores), metrics grid
- **My Purchases tab**: Purchase tracking table with status management
- **Settings tab**: Deal criteria config, county management, bot controls

### Ana Sales - Sales Bot
- **Pipeline tab**: Draggable Kanban board (Lead → Qualified → Proposal → Negotiating → Won/Lost), color-coded cards with deal details, click for full prospect modal
- **Proposals tab**: Table with engagement scores, click for proposal analytics with view heatmap
- **Activity Log tab**: Timeline of all interactions (calls, emails, meetings), filterable
- **Analytics tab**: Conversion funnel visualization, revenue charts, deal size distribution, top performers
- **Settings tab**: Template management, email sequences, bot controls

### Trading Bot
- **Dashboard tab**: Large P&L display with time period tabs, account balance chart, quick stats (win rate, Sharpe ratio, max drawdown), recent trades
- **Open Positions tab**: Live positions table with P&L, click for trade details with chart markup
- **Trade History tab**: Searchable/filterable trade log with CSV export
- **Strategies tab**: Performance comparison table, click for detailed strategy breakdown
- **Risk Monitor tab**: Circular gauge indicators for daily loss limit, position count, trade count, buying power display, risk rules checklist
- **Settings tab**: Risk parameters display, trading controls, symbol analyzer

---

## Phase 3: Bot Deep Dive Pages (Part 2)

### Rhianna Research - Intelligence Bot
- **Today's Brief tab**: Formatted daily intelligence report with expandable sections (Top Insights, Opportunities, Threats, Content Ideas, Recommended Actions)
- **Opportunities tab**: Card grid of detected business problems with source links, deal size estimates, "Send to Ana" action button
- **Competitors tab**: Tracked competitor cards with threat level gauges, detailed competitor profiles
- **Trends tab**: Emerging trends with scores, monetization potential, stage indicators (Emerging/Growing/Mainstream)
- **Content Ideas tab**: Generated topics with platform recommendations, "Send to Carter" button
- **Settings tab**: Source monitoring config, alert thresholds, scan frequency

### Deondre - Dropshipping Bot
- **Products tab**: Product card grid with status badges, ROAS indicators, click for full metrics and charts
- **Performance tab**: Revenue dashboard with time tabs, performance table with quick Kill/Scale actions
- **Ad Campaigns tab**: Campaign table with creative previews, audience targeting, budget controls
- **Suppliers tab**: Supplier cards with ratings, ship times, quality scores
- **Settings tab**: Product criteria, ROAS thresholds, bot controls

### Carter - Content Engine Bot
- **Calendar tab**: Weekly/monthly content calendar color-coded by platform, drag to reschedule, schedule post form
- **Performance tab**: Weekly overview cards, platform comparison charts, top posts grid with click-through analytics
- **Platform Stats tab**: Individual platform cards (YouTube, TikTok, X, Instagram, LinkedIn, Facebook) with metrics and trend arrows
- **Content Library tab**: Searchable content grid with thumbnails, filters, "Repurpose" button
- **Settings tab**: Posting schedule, content pillars, AI avatar config, bot controls

---

## Phase 4: Hub Pages & Settings

### Revenue Hub
- Revenue breakdown pie chart by source
- Monthly comparison bar chart (last 6 months)
- Active opportunities cards with total pipeline value
- Revenue trend line chart
- Monthly target tracker with progress bar and daily revenue needed calculation

### Unified Calendar
- Monthly calendar combining all bot events, color-coded by bot type
- Filter checkboxes to show/hide each bot's events
- Click event to navigate to source

### Analytics Hub
- Cross-bot performance comparison table
- Revenue attribution by bot
- Attention indicators for underperforming bots
- Custom date range selector
- Export report button

### Raw Data Access
- Table selector dropdown
- Full data grid with sort, filter, pagination, search
- CSV export
- SQL query builder with execute and results display
- Database health monitor

### Settings Page
- System Monitoring: Deployment status, workflow status, API usage meters
- Integrations: Google Drive, n8n workflow triggers and logs
- Notifications: Alert type config, channel preferences, thresholds
- Display: Theme, refresh interval, default time range, sidebar defaults
- Bot Configuration: Links to each bot's settings, global emergency stop
- User Profile: Info display, full data export

---

## Data & Technical Details
- All mock data structured to match future Supabase schema (bots, notifications, revenue, tasks, properties, prospects, trades, products, content, competitors, trends)
- Proper money formatting ($XX,XXX), percentages (X.X%), dates (MMM DD, YYYY), time-ago strings, K/M notation
- React Query for data fetching with 60-second auto-refresh
- Skeleton loaders for loading states, toast notifications for errors
- Framer Motion for page transitions, card animations, and hover effects
- Responsive: desktop-optimized (1440px+), sidebar collapses on smaller screens, grid adapts to 2-col/1-col

