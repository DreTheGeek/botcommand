
# Lock Down Signups — Remove Registration UI

## What's Already Verified
- Telegram edge function is live and working (Ronnie test passed with 200 OK)
- Your account exists: `dre@kaldrbusiness.com` with admin role and "LaSean" profile
- Login flow works: authenticated users redirect from /login to dashboard
- Protected routes enforce authentication

## Changes to Make

### 1. Update `src/pages/LoginPage.tsx`
- Remove `isSignUp` state and all signup-related logic
- Remove `displayName` state and input field
- Remove the "Need an account? Sign up" toggle button
- Remove the signup branch in `handleSubmit` (keep only `signInWithPassword`)
- Change the heading from conditional to static "Welcome Back"
- Keep only the sign-in form: email, password, submit button

### 2. Disable Auto-Confirm
- Use configure-auth to set `auto_confirm_email` back to `false`
- This means even if someone tries to call the signup API directly, they'd need email verification (which you control)

## Result
- Login page shows only a sign-in form — no way to create an account through the UI
- Server-side signup requires email confirmation — locked to your email domain
- Your existing session continues working normally
