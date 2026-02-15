

# Phase 4: Mobile Fixes, 6-Bot Telegram Integration, Signup Lockdown, and Login Testing

## Overview

This plan covers: (1) mobile responsiveness fixes across all pages, (2) a multi-bot Telegram notification system with 6 separate bot tokens and 6 chat IDs, (3) locking down signups after your account is created, and (4) testing the login flow.

---

## 1. Mobile Responsiveness Fixes

CSS-only changes -- wrap tables in `overflow-x-auto` containers and fix grid breakpoints.

**Files to update:**

- `src/pages/bots/RonnieRealty.tsx` -- Table scroll wrapper, dialog grid stacks to 1 column on mobile
- `src/pages/bots/AnaSales.tsx` -- Kanban columns get horizontal scroll on mobile
- `src/pages/bots/TradingBot.tsx` -- Trade history and open positions tables get scroll wrappers
- `src/pages/RawData.tsx` -- Data table scroll wrapper
- `src/pages/AnalyticsHub.tsx` -- Cross-bot table scroll wrapper
- `src/pages/CalendarPage.tsx` -- Calendar and filters stack vertically on mobile
- `src/pages/bots/CarterContent.tsx` -- Verify grid uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- `src/pages/bots/DeondreDropshipping.tsx` -- Verify grid uses `grid-cols-1` on mobile

---

## 2. Telegram Bot Integration (6 Bots, 6 Channels)

### Secrets (12 total)

Each bot gets its own token and chat ID stored securely:

| Secret Name | Description |
|---|---|
| `TELEGRAM_RONNIE_BOT_TOKEN` | Ronnie Realty bot token from @BotFather |
| `TELEGRAM_RONNIE_CHAT_ID` | Ronnie's dedicated channel/group chat ID |
| `TELEGRAM_ANA_BOT_TOKEN` | Ana Sales bot token |
| `TELEGRAM_ANA_CHAT_ID` | Ana's channel chat ID |
| `TELEGRAM_TAMMY_BOT_TOKEN` | Tammy Trader bot token |
| `TELEGRAM_TAMMY_CHAT_ID` | Tammy's channel chat ID |
| `TELEGRAM_RHIANNA_BOT_TOKEN` | Rhianna Research bot token |
| `TELEGRAM_RHIANNA_CHAT_ID` | Rhianna's channel chat ID |
| `TELEGRAM_DEONDRE_BOT_TOKEN` | Deondre Dropshipping bot token |
| `TELEGRAM_DEONDRE_CHAT_ID` | Deondre's channel chat ID |
| `TELEGRAM_CARTER_BOT_TOKEN` | Carter Content bot token |
| `TELEGRAM_CARTER_CHAT_ID` | Carter's channel chat ID |

### Edge Function

**New file: `supabase/functions/send-telegram/index.ts`**

- Accepts POST with `{ bot_id, message, parse_mode? }`
- `bot_id` is one of: `ronnie`, `ana`, `tammy`, `rhianna`, `deondre`, `carter`
- Maps `bot_id` to the corresponding `TELEGRAM_{NAME}_BOT_TOKEN` and `TELEGRAM_{NAME}_CHAT_ID` secrets
- Calls `https://api.telegram.org/bot{token}/sendMessage` with the chat ID and message
- Returns success/failure with CORS headers
- Validates auth via `getClaims()` so only you can trigger notifications

**Update: `supabase/config.toml`**

```text
[functions.send-telegram]
verify_jwt = false
```

### Settings Page Update

**Update: `src/pages/SettingsPage.tsx`**

Replace the single Telegram integration card with 6 individual Telegram bot entries:

- Show each bot name with its Telegram icon
- "Send Test" button per bot that calls the edge function with that bot's ID
- Toast feedback on success/failure
- Each shows connection status based on whether secrets are configured

---

## 3. Disable Signups (Lock to Your Account Only)

### Phase 3a: Temporary (current state)
- Auto-confirm is already enabled
- Login page currently has signup toggle
- You sign up with your email and password right now

### Phase 3b: After you create your account
- **Update `src/pages/LoginPage.tsx`**: Remove `isSignUp` state, remove signup toggle button, remove display name field, keep only sign-in form
- **Disable auto-confirm**: Revert the auth configuration so email confirmation is required (prevents API-level signups from working easily)
- Result: Login page only shows sign-in, and even direct API calls to signup would require email verification you control

---

## 4. Login Flow Testing

1. Navigate to `/login` -- verify form renders
2. Toggle to "Sign Up" -- enter email, password, display name
3. Submit -- verify auto-confirm works and you're redirected to dashboard
4. Check database for profile and user_role records
5. Sign out via TopNav -- verify redirect to login
6. Sign back in -- verify session persistence
7. After successful account creation, deploy the signup removal

---

## File Summary

| File | Action |
|---|---|
| `supabase/functions/send-telegram/index.ts` | Create -- multi-bot Telegram edge function |
| `supabase/config.toml` | Update -- add send-telegram config |
| `src/pages/SettingsPage.tsx` | Update -- 6 Telegram bot cards with test buttons |
| `src/pages/LoginPage.tsx` | Update -- remove signup after account creation |
| `src/pages/bots/RonnieRealty.tsx` | Update -- mobile scroll wrappers |
| `src/pages/bots/AnaSales.tsx` | Update -- mobile Kanban scroll |
| `src/pages/bots/TradingBot.tsx` | Update -- table scroll wrappers |
| `src/pages/RawData.tsx` | Update -- table scroll wrapper |
| `src/pages/AnalyticsHub.tsx` | Update -- table scroll wrapper |
| `src/pages/CalendarPage.tsx` | Update -- stack layout on mobile |

---

## Execution Order

1. Store all 12 Telegram secrets (bot tokens + chat IDs)
2. Create send-telegram edge function and deploy
3. Apply mobile responsiveness fixes across all pages
4. Update Settings page with per-bot Telegram test buttons
5. You create your account via the login page
6. Remove signup UI from LoginPage
7. Disable auto-confirm

---

## Technical Notes

- Edge function uses a simple mapping object to resolve bot_id to secret names -- no database needed
- All 12 secrets are stored securely and never exposed in frontend code
- The edge function validates JWT claims so only authenticated users can send notifications
- Mobile fixes are pure CSS -- no logic changes
- No new npm dependencies required
