# Analytics & Insights Setup Guide

## What We Just Built

We've added a complete analytics system to Watercooler that tracks:
- **View counts** for each startup
- **Heat maps** showing what categories, locations, and stages are most popular
- **Most viewed startups** leaderboard

## Next Steps (Simple Instructions)

### Step 1: Run the Database Migration

When your database is available, run this command in your terminal:

```bash
npx prisma migrate dev --name add_view_tracking
```

**What this does:** Adds a `views` column to your database to track how many times each startup is viewed.

**When to run it:** 
- Make sure your Supabase database is running/accessible
- Run this command in the terminal where you have the project open

### Step 2: Verify It Worked

After running the migration, you should see a message like:
```
✔ Migration applied successfully
```

### Step 3: Test the Analytics Page

1. Make sure your dev server is running (`npm run dev`)
2. Visit: `http://localhost:3000/analytics`
3. You should see the analytics dashboard with heat maps!

### Step 4: Start Tracking Views

- Every time someone visits a startup profile page, the view count automatically increments
- The analytics page will show real-time data based on these views

## What You'll See on the Analytics Page

1. **Stats Overview**
   - Total number of startups
   - Total views across all startups
   - Average views per startup

2. **Most Viewed Startups**
   - Top 10 startups ranked by views
   - Shows logo, name, and view count

3. **Category Interest Heat Map**
   - Color-coded tiles showing which categories get the most views
   - Darker blue = more popular

4. **Location Interest Heat Map**
   - Top 20 locations ranked by views
   - Shows where people are most interested

5. **Company Stage Interest**
   - Heat map showing which stages (Idea, Building, Private Beta, Live) are most viewed

6. **Funding Interest**
   - Heat map showing which funding stages get the most attention

## Troubleshooting

**If the migration fails:**
- Check that your Supabase database is running
- Verify your `.env` file has the correct `DATABASE_URL`
- Try running the migration again

**If you see errors about "views" field:**
- Make sure you ran `npx prisma generate` after the migration
- Restart your dev server (`npm run dev`)

**If the analytics page is empty:**
- This is normal if no one has viewed startups yet!
- Visit a few startup profile pages to generate some view data
- Refresh the analytics page to see the updated data

## Need Help?

If you run into any issues, check:
1. Is your database connection working? (Check your `.env` file)
2. Did the migration complete successfully?
3. Is your dev server running?

The analytics will start collecting data automatically once the migration is complete!

