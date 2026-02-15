
# Full Real-Time Command Center: Chat Overhaul + Live Data Pipeline

## The Problem
Every piece of data on your dashboard and bot pages is **hardcoded fake data** from `mockData.ts`. Your bots send you real information via Telegram, but none of it flows into the dashboard. You also need a full-featured chat experience (files, images, voice) to communicate with each bot individually.

## What This Plan Delivers

### Part 1: Full-Featured Chat Page
Transform the chat into a Telegram-like experience:
- **Individual 1:1 conversations** with each bot (remove the "Cross-Bot View" toggle)
- **File/image uploads** via a paperclip button (stored in a storage bucket, sent to Telegram)
- **Microphone button** for voice-to-text using the browser's built-in Speech Recognition (no API key needed)
- **Rich media rendering** for incoming photos, documents, and voice messages from bots
- **Cross-bot learning stays invisible** in the backend (AI context injection already working)

### Part 2: AI-Powered Data Extraction Pipeline
When a bot sends a message via Telegram, an AI automatically parses it and extracts structured data:
- Ronnie sends "Found a 3BR in Tampa, $18K min bid, ARV $185K" -- AI extracts it into the `bot_data_entries` table with category "property_deal"
- Tammy sends "Closed NVDA +$89, 27 shares" -- AI extracts it as a "trade" entry
- This happens automatically on every incoming webhook message

### Part 3: Live Dashboard
Replace all mock data imports with real database queries:
- Dashboard stats, alerts, revenue -- all pulled from `bot_data_entries`
- Bot pages show real data submitted by bots
- Realtime subscriptions so new data appears instantly without page refresh

## Database Changes

### New table: `bot_data_entries`
A flexible table that stores all structured data extracted from bot messages:

| Column | Type | Purpose |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| user_id | uuid | Owner |
| bot_id | text | Which bot sent it |
| category | text | e.g. "property_deal", "trade", "prospect", "content_stat", "alert" |
| data | jsonb | The extracted structured data (flexible schema per category) |
| source_message_id | uuid | Links back to the original chat_messages row |
| created_at | timestamptz | When it was created |

This single table replaces ALL mock data arrays (properties, trades, prospects, products, etc.) by using `category` to differentiate and `data` (JSONB) to store the specifics.

### Updated table: `chat_messages`
Add columns:
- `message_type` (text, default 'text') -- text, photo, document, voice
- `file_url` (text, nullable) -- URL to uploaded file in storage
- `file_name` (text, nullable) -- original filename for documents

### New storage bucket: `chat-attachments`
Public bucket for uploaded files and images, with RLS policies for authenticated users.

### Enable realtime on `bot_data_entries`

## Edge Function Changes

### Update `telegram-webhook` (incoming messages)
After inserting the incoming message into `chat_messages`:
1. Call Lovable AI to analyze the message content
2. If it contains actionable data (a deal, a trade, a metric, an alert), extract it as structured JSON
3. Insert into `bot_data_entries` with the appropriate category
4. Handle incoming photos/documents/voice: download from Telegram, upload to storage bucket, save URL

### Update `send-telegram` (outgoing messages)
- Accept `type` parameter (text, photo, document)
- For photos/documents: use Telegram's `sendPhoto`/`sendDocument` API with the file URL from the storage bucket
- Keep cross-bot AI context injection (already working)

## Frontend Changes

### Chat Page (`ChatPage.tsx`) -- Full Redesign
- Remove "Cross-Bot View" toggle
- Add **paperclip button** for file/image uploads
- Add **microphone button** using Web Speech API (SpeechRecognition)
- Render incoming images inline, documents as file cards, voice as audio players
- New components: `ChatMediaMessage.tsx`, `VoiceRecordButton.tsx`, `FileUploadButton.tsx`

### Dashboard Components -- Switch to Real Data
Every component currently importing from `mockData.ts` gets updated:

| Component | Current Source | New Source |
|---|---|---|
| `BotStatusGrid` | `bots` from mockData | Query `bot_data_entries` for latest status per bot |
| `RevenueDashboard` | `revenue` from mockData | Aggregate `bot_data_entries` where category = 'revenue' or 'trade' |
| `AlertCenter` | `notifications` from mockData | Query `bot_data_entries` where category = 'alert', ordered by recency |
| `QuickStats` | `quickStats` from mockData | Aggregate counts from `bot_data_entries` by category |
| `TodaysFocus` | `tasks` from mockData | Query `bot_data_entries` where category = 'task' |
| `BotPerformanceChart` | Hardcoded array | Aggregate `bot_data_entries` metrics per bot |

### Bot Pages -- Switch to Real Data
Each bot page (Ronnie, Ana, Tammy, etc.) will query `bot_data_entries` filtered by `bot_id` and `category` instead of importing from mockData.

### Custom Hook: `useBotData`
A reusable React Query hook that:
- Fetches `bot_data_entries` filtered by bot_id and/or category
- Subscribes to realtime changes
- Returns loading/error states
- Auto-refreshes on new data

## Architecture Flow

```text
Telegram Bot sends message
        |
        v
  telegram-webhook edge function
   - Saves message to chat_messages
   - Downloads media if present (photo/doc/voice)
   - Calls Lovable AI to extract structured data
   - Inserts extracted data into bot_data_entries
        |
        v
  Supabase Realtime broadcasts changes
        |
        v
  Dashboard + Bot Pages auto-update
  Chat Page shows new message
```

## File Summary

| File | Action |
|---|---|
| New migration SQL | Add columns to chat_messages, create bot_data_entries table, create storage bucket, RLS policies, enable realtime |
| `supabase/functions/telegram-webhook/index.ts` | Major update -- AI data extraction + media handling |
| `supabase/functions/send-telegram/index.ts` | Update -- support photo/document sending |
| `src/pages/ChatPage.tsx` | Full redesign -- file upload, mic, media rendering |
| `src/components/chat/ChatMediaMessage.tsx` | New -- renders images, docs, voice |
| `src/components/chat/VoiceRecordButton.tsx` | New -- mic button with Web Speech API |
| `src/components/chat/FileUploadButton.tsx` | New -- paperclip file picker + upload |
| `src/hooks/useBotData.ts` | New -- reusable hook for querying bot_data_entries with realtime |
| `src/components/dashboard/BotStatusGrid.tsx` | Update -- use useBotData instead of mockData |
| `src/components/dashboard/RevenueDashboard.tsx` | Update -- use useBotData |
| `src/components/dashboard/AlertCenter.tsx` | Update -- use useBotData |
| `src/components/dashboard/QuickStats.tsx` | Update -- use useBotData |
| `src/components/dashboard/TodaysFocus.tsx` | Update -- use useBotData |
| `src/components/dashboard/BotPerformanceChart.tsx` | Update -- use useBotData |
| `src/pages/bots/RonnieRealty.tsx` | Update -- use useBotData |
| `src/pages/bots/AnaSales.tsx` | Update -- use useBotData |
| `src/pages/bots/TradingBot.tsx` | Update -- use useBotData |
| `src/pages/bots/RhiannaResearch.tsx` | Update -- use useBotData |
| `src/pages/bots/DeondreDropshipping.tsx` | Update -- use useBotData |
| `src/pages/bots/CarterContent.tsx` | Update -- use useBotData |
| `src/pages/RevenueHub.tsx` | Update -- use useBotData |
| `src/pages/AnalyticsHub.tsx` | Update -- use useBotData |
| `src/data/mockData.ts` | Keep as fallback/types reference, but no longer imported by components |

## What You'll Need to Do
- **Nothing extra** -- all secrets (Telegram tokens, AI key) are already configured
- Once deployed, send a test message from any Telegram bot and watch it appear in the chat AND populate the dashboard in real time

## Important Notes
- The dashboard will initially be empty until bots start sending messages -- this is expected since we're removing fake data
- The AI extraction uses `google/gemini-3-flash-preview` (fast, already available via Lovable AI)
- Voice-to-text uses the browser's built-in Web Speech API -- works in Chrome, Edge, Safari (no API key needed)
- All files uploaded through chat are stored in a storage bucket, never in the database
