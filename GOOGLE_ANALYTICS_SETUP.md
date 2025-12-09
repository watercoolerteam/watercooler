# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your Watercooler application.

## Step 1: Create a Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Admin" (gear icon) in the bottom left
4. In the "Property" column, click "Create Property"
5. Fill in:
   - Property name: "Watercooler" (or your preferred name)
   - Reporting time zone: Choose your timezone
   - Currency: Choose your currency
6. Click "Next" and fill in business information
7. Click "Create"

## Step 2: Get Your Measurement ID

1. After creating the property, you'll see a "Data Streams" section
2. Click "Add stream" → "Web"
3. Fill in:
   - Website URL: Your domain (e.g., `https://watercooler.com`)
   - Stream name: "Watercooler Web" (or your preferred name)
4. Click "Create stream"
5. You'll see a "Measurement ID" (format: `G-XXXXXXXXXX`)
6. Copy this Measurement ID

## Step 3: Add Environment Variable

1. Open your `.env.local` file (or `.env` if you don't have `.env.local`)
2. Add the following line:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. If deploying to Vercel:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_GA_ID` with your Measurement ID
   - Make sure it's available for all environments (Production, Preview, Development)

## Step 4: Restart Your Dev Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Step 5: Verify It's Working

1. Visit your site in a browser
2. Open Google Analytics → Reports → Realtime
3. You should see your visit appear within a few seconds
4. You can also check the browser console - there should be no errors related to Google Analytics

## What's Tracked Automatically

The integration automatically tracks:

- **Page views** - All page navigations
- **Startup views** - When someone views a startup profile
- **Startup submissions** - When someone submits a startup
- **Startup claims** - When a founder claims their startup
- **Searches** - When someone searches for startups
- **Update posts** - When founders post updates

## Custom Event Tracking

You can track custom events in your code using the analytics utilities:

```typescript
import { trackEvent } from "@/lib/analytics";

// Track a custom event
trackEvent("button_click", "Navigation", "Sign Up Button");
```

Available tracking functions:
- `trackPageView(url)` - Track a page view
- `trackEvent(action, category, label?, value?)` - Track a custom event
- `trackStartupView(slug, name)` - Track startup profile view
- `trackStartupSubmission(name)` - Track startup submission
- `trackStartupClaim(slug)` - Track startup claim
- `trackSearch(query, resultsCount)` - Track search queries
- `trackUpdatePost(slug)` - Track update posts

## Privacy Considerations

- Google Analytics collects user data. Make sure you comply with GDPR, CCPA, and other privacy regulations
- Consider adding a cookie consent banner if required in your jurisdiction
- You can configure Google Analytics to respect "Do Not Track" headers in your GA4 settings

## Troubleshooting

**Analytics not showing data:**
- Verify `NEXT_PUBLIC_GA_ID` is set correctly in your environment variables
- Check that the Measurement ID starts with `G-`
- Make sure you've restarted your dev server after adding the env variable
- Check browser console for any errors
- Verify in Google Analytics that the data stream is active

**Events not tracking:**
- Make sure `window.gtag` is available (check browser console)
- Verify the event is being called after the page loads
- Check Google Analytics → Admin → Events to see if events are being received

## Next Steps

- Set up custom goals in Google Analytics
- Create custom reports and dashboards
- Set up conversion tracking for key actions
- Configure audience segments
- Set up email reports
