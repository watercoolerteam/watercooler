# Finding Your Connection String

## Option 1: Check Settings > API
1. In the left sidebar, click **"Settings"** (the gear icon)
2. Click **"API"** (not Database)
3. Look for **"Connection string"** or **"Database URL"** section
4. You should see the connection string there

## Option 2: Get Project Reference from URL
1. Look at your browser's address bar
2. The URL will look like: `https://supabase.com/dashboard/project/abcdefghijklmnop`
3. The part after `/project/` is your project reference (the random letters/numbers)
4. Copy that project reference

## Option 3: Build It Manually
If you can find:
- Your project reference (from the URL)
- Your database password (the one you created, or you can reset it using the "Reset database password" button)

I can help you build the connection string in the format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Try Option 1 first - go to Settings > API and see if the connection string is there!

