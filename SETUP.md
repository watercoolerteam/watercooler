# Simple Setup Guide for Watercooler

## Step 1: Create a Supabase Account (Free)

1. Go to https://supabase.com
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email (it's free)
4. Click "New Project"
5. Fill in:
   - **Name**: watercooler (or any name you like)
   - **Database Password**: Create a strong password (save this somewhere!)
   - **Region**: Choose the closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for it to set up

## Step 2: Get Your Database Connection String

1. Once your project is ready, click on your project
2. Click the "Settings" icon (gear) in the left sidebar
3. Click "Database" in the settings menu
4. Scroll down to "Connection string"
5. Find the section that says "URI" (not "Session mode" or "Transaction")
6. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. Click the "Copy" button next to it
8. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created in Step 1

## Step 3: Add the Connection String to Your Project

I'll help you create the .env file with your connection string. Just paste it when I ask!

## Step 4: Set Up the Database Tables

Once you have the .env file, I'll run a command to create all the database tables automatically.

## Step 5: You're Done!

After that, your app will be fully working!

