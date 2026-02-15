
# Full Authentication, Integrations, and Dashboard Enhancements

## Overview

This plan adds real authentication (only you can log in), an integrations panel in Settings, and interactive dashboard charts that link to each bot's analytics. It requires connecting to Lovable Cloud first.

---

## Step 1: Connect to Lovable Cloud (Required First)

Before any auth work, we need to enable Lovable Cloud to get a Supabase backend. This gives us:
- User authentication (email/password)
- Database for any future data persistence
- Edge functions for integrations

**Action needed from you**: After approving this plan, we will enable Cloud and set up the database.

---

## Step 2: Authentication System

### Database Schema
- **profiles table**: `id` (FK to auth.users), `display_name`, `email`, `created_at`
- **user_roles table**: `user_id` (FK to auth.users), `role` (enum: admin/user)
- RLS policies so only authenticated users can access data
- Trigger to auto-create profile on signup

### New Files
- `src/pages/LoginPage.tsx` -- Clean login form with email/password, NEXUS branding, dark theme matching the dashboard aesthetic
- `src/contexts/AuthContext.tsx` -- Auth provider wrapping the app with `onAuthStateChange` listener, session management, and a `useAuth()` hook
- `src/components/ProtectedRoute.tsx` -- Wrapper component that redirects to `/login` if not authenticated

### Changes to Existing Files
- `src/App.tsx` -- Wrap routes with AuthProvider, add `/login` route, protect all other routes with ProtectedRoute
- `src/components/layout/TopNav.tsx` -- Wire the "Sign Out" dropdown item to actually call `supabase.auth.signOut()`
- `src/pages/SettingsPage.tsx` -- Show real user email from auth session instead of hardcoded "lasean@nexus.ai"

### Security
- After initial deploy, you create your account via the login page (signup mode)
- Then we disable signup so nobody else can register (via Supabase dashboard or edge function)
- Only your email can access the system

---

## Step 3: Integrations Panel in Settings

Add a new "Integrations" card to `src/pages/SettingsPage.tsx` with:

- **Telegram** -- Link to Telegram bot setup, status indicator, webhook URL display
- **GitHub** -- Link to connected repo, status badge
- **Google Drive** -- Link to connected folder
- **n8n / Automation** -- Webhook URL display for workflow triggers
- **Supabase** -- Connection status, link to dashboard

Each integration shows:
- Service name and icon
- Connection status badge (Connected/Not Connected)
- "Connect" or "Configure" button linking to the appropriate service
- For Telegram: a field to store bot token (saved as Supabase secret)

This keeps it clean -- real links and status displays, with the ability to add API keys for services that need them (like Telegram bot token) stored securely as Supabase secrets.

---

## Step 4: Interactive Dashboard Charts

Enhance `src/pages/Index.tsx` and `src/components/dashboard/RevenueDashboard.tsx`:

- Add a mini sparkline/bar chart to each bot card in BotStatusGrid showing recent performance (clickable, navigates to bot's analytics tab)
- Make the revenue breakdown sections in RevenueDashboard clickable -- clicking "Trading Profits" navigates to `/bots/trading`, "Dropshipping" to `/bots/deondre`, etc.
- Add a small "Bot Performance" Recharts bar chart below QuickStats comparing all 6 bots' key metrics side by side, with each bar clickable to navigate to that bot

---

## File Summary

| File | Action |
|------|--------|
| `src/pages/LoginPage.tsx` | Create -- login/signup form |
| `src/contexts/AuthContext.tsx` | Create -- auth provider + hook |
| `src/components/ProtectedRoute.tsx` | Create -- route guard |
| `src/integrations/supabase/client.ts` | Create -- Supabase client init |
| `src/App.tsx` | Update -- add auth provider, login route, protected routes |
| `src/components/layout/TopNav.tsx` | Update -- real sign out |
| `src/pages/SettingsPage.tsx` | Update -- integrations panel, real user data |
| `src/pages/Index.tsx` | Update -- add bot performance chart |
| `src/components/dashboard/BotStatusGrid.tsx` | Update -- add mini performance indicators |
| `src/components/dashboard/RevenueDashboard.tsx` | Update -- clickable revenue sources |
| Supabase migrations | Create profiles table, user_roles table, RLS policies, triggers |

---

## Technical Notes

- Auth uses Supabase's built-in `onAuthStateChange` set up BEFORE `getSession()` per best practices
- Login page matches NEXUS dark theme with gradient background and teal accents
- No new dependencies needed -- Supabase client comes from Lovable Cloud connection
- Integration links open in new tabs (`target="_blank"`)
- All charts use existing Recharts library
- Clickable chart elements use `onClick` handlers with `useNavigate()`
