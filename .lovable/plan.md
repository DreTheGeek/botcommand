

# AI-Powered Cross-Bot Context Injection

## Overview
When you send a message to any bot, the system will automatically fetch recent messages from all OTHER bots, generate an AI summary using Lovable AI, and prepend it to your Telegram message. This way each bot sees what the others have been discussing.

## How It Works

1. You type a message to Ana in the chat page
2. The backend function fetches the last 20 messages from Ronnie, Tammy, Rhianna, Deondre, and Carter
3. Lovable AI (gemini-3-flash-preview) summarizes those messages into 2-3 sentences
4. The message sent to Telegram looks like:

```text
--- Cross-Bot Context ---
Ronnie discussed a new lead on Oak Street. Carter drafted social posts for the weekend campaign.
---

Hey Ana, can you follow up on the Oak Street lead pricing?
```

5. Your original message is stored in the database as-is (without the context prefix)

## Changes

### 1. Update `supabase/functions/send-telegram/index.ts`
- Create a second Supabase client using SERVICE_ROLE_KEY to query cross-bot messages (bypasses RLS)
- Query the last 20 messages from all bots EXCEPT the target bot_id
- Call Lovable AI gateway to summarize the cross-bot activity
- Prepend the summary to the Telegram message text
- Store only the original message (without context) in chat_messages
- Graceful fallback: if AI call fails or no cross-bot messages exist, send the original message without context

### 2. No frontend changes needed
The chat UI already displays messages as stored. The context injection is entirely server-side.

### 3. No database changes needed
The existing chat_messages table has everything required.

## Technical Details

| Detail | Value |
|---|---|
| AI Model | google/gemini-3-flash-preview |
| AI Gateway | https://ai.gateway.lovable.dev/v1/chat/completions |
| API Key | LOVABLE_API_KEY (already configured) |
| Context window | Last 20 messages across all other bots |
| Added latency | ~1-2 seconds per send |
| Fallback | Send original message if AI fails |

## File Summary

| File | Action |
|---|---|
| supabase/functions/send-telegram/index.ts | Update - add cross-bot context query and AI summarization |

