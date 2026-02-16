

# Dual Database Dashboard + Unread Indicators

## Overview
Keep the existing Lovable Cloud backend for Telegram chat and bot messaging, while adding a second connection to your external database for dashboard data. Also add unread message indicators to the chat sidebar.

## Part 1: External Database Connection

### New file: `src/lib/externalSupabase.ts`
Create a second client pointing to your external database (eqmhvckilhevjqnjczjc.supabase.co). The anon key will be stored as a secret and loaded via an environment variable (`VITE_EXTERNAL_SUPABASE_ANON_KEY`), OR hardcoded if you provide it.

**Before implementation**: You'll need to provide the anon key for your external Supabase project so I can configure it.

### New hook: `src/hooks/useExternalData.ts`
A React Query hook that fetches from the external database tables:
- `ecosystem_health` -- bot status cards
- `revenue_tracking` -- revenue dashboard
- `system_notifications` -- alert center
- `bot_messages` -- pending message counts
- `property_deals` -- Ronnie metrics
- `deals` -- Ana pipeline
- `trades` -- Tammy performance
- `opportunities` -- Rhianna insights
- `products` -- Deondre scaling
- `content_posts` -- Carter views

Each query auto-refreshes every 60 seconds using React Query's `refetchInterval`.

## Part 2: Dashboard Component Updates

Update these components to use the external data hook instead of (or alongside) `useBotData`:

| Component | External Table | Fallback |
|---|---|---|
| `BotStatusGrid` | `ecosystem_health` | Shows "Awaiting data..." |
| `RevenueDashboard` | `revenue_tracking` | Shows $0 |
| `AlertCenter` | `system_notifications` | Shows empty state |
| `QuickStats` | Aggregates from multiple tables | Shows zeroes |
| `TodaysFocus` | Stays on `bot_data_entries` (Telegram tasks) | No change |
| `BotPerformanceChart` | Aggregates from external tables | Shows zero bars |

Each bot's deep-dive page will also query its relevant external table.

## Part 3: Unread Message Indicators

### How it works
- Track which bot the user is currently viewing (`selectedBot`)
- Subscribe to realtime `INSERT` events on `chat_messages` for ALL bots (not just the selected one)
- Maintain a `Set<string>` of bot IDs with unread messages
- When a new incoming message arrives for a bot that isn't currently selected, add that bot ID to the unread set
- When the user switches to a bot, remove it from the unread set
- Display a colored dot/badge next to the bot name in the sidebar

### Changes to `ChatPage.tsx`
- Add `unreadBots` state (`Set<string>`)
- Broaden the realtime subscription to listen for all bots, not just `selectedBot`
- Show a pulsing dot or badge count next to unread bot names

## Part 4: Pipeline Verification

The existing Telegram pipeline (webhook receives message -> saves to chat_messages -> AI extracts to bot_data_entries) is already functional. To verify:
- Send a test message from any Telegram bot
- Check `chat_messages` table for the new row
- Check `bot_data_entries` for the extracted data entry
- Verify it appears in the chat UI and dashboard

## Technical Details

| Detail | Value |
|---|---|
| External DB URL | https://eqmhvckilhevjqnjczjc.supabase.co |
| External DB anon key | Needs to be provided by you |
| Refresh interval | 60 seconds (React Query refetchInterval) |
| Realtime for chat | Uses Lovable Cloud (existing) |
| Realtime for dashboard | Polling-based from external DB (60s) |

## File Summary

| File | Action |
|---|---|
| `src/lib/externalSupabase.ts` | Create -- second Supabase client for external DB |
| `src/hooks/useExternalData.ts` | Create -- hooks for fetching external dashboard data |
| `src/pages/ChatPage.tsx` | Update -- add unread message indicators |
| `src/components/dashboard/BotStatusGrid.tsx` | Update -- use external data |
| `src/components/dashboard/RevenueDashboard.tsx` | Update -- use external data |
| `src/components/dashboard/AlertCenter.tsx` | Update -- use external data |
| `src/components/dashboard/QuickStats.tsx` | Update -- use external data |
| `src/components/dashboard/BotPerformanceChart.tsx` | Update -- use external data |
| Bot deep-dive pages (6 files) | Update -- use external data for metrics |

## What You Need to Do
- Provide the **anon key** for your external Supabase project (eqmhvckilhevjqnjczjc)
- Ensure the external database tables have the correct RLS policies to allow reads with the anon key (or are publicly readable)

