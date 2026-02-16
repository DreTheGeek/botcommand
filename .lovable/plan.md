

# Add External Supabase Anon Key

## What's changing
One file update to hardcode the publishable anon key into the external Supabase client.

## File: `src/lib/externalSupabase.ts`
- Set the anon key directly as the fallback value instead of an empty string
- This means the client will always initialize successfully, eliminating the "supabaseKey is required" error
- The `VITE_EXTERNAL_SUPABASE_ANON_KEY` env var override is kept as a secondary option, but the hardcoded key serves as the default

## Why this is safe
Supabase anon keys are **publishable** -- they are designed to be used in client-side code. Security is enforced through Row Level Security (RLS) policies on the database, not by hiding the key.

## Result
After this change, the dashboard will immediately begin fetching live data from your external database tables (ecosystem_health, revenue_tracking, etc.) with 60-second auto-refresh.

## Technical Detail

```
const supabaseAnonKey = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbWh2Y2tpbGhldmpxbmpjempjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjk1NzIsImV4cCI6MjA4NjYwNTU3Mn0.faWYhlzg6d4tbvuW0svTTg3sAQzDcB313SWMWxTVZ9Q';
```
