# Troubleshooting Database Connection

The connection isn't working. Let's check a few things in Supabase:

## Check 1: Is the Database Ready?
1. In your Supabase dashboard, check if your project shows as "Active" or "Ready"
2. Sometimes it takes 2-5 minutes after creation for the database to be fully ready

## Check 2: IP Restrictions
1. Go to **Settings > Database**
2. Look for any section about:
   - "IP Allowlist"
   - "Network Access"
   - "Firewall"
   - "Connection Security"
3. If you see IP restrictions, you might need to:
   - Add your IP address
   - Or temporarily allow all IPs for setup

## Check 3: Connection Pooling
Sometimes Supabase requires using connection pooling. In Settings > Database > Connection pooling, look for:
- A different connection string format
- Port 6543 instead of 5432
- A "pooler" URL

## What to Try:
1. Wait 2-3 more minutes if the project was just created
2. Check for IP restrictions in Settings > Database
3. Look for a connection pooling URL in the Connection pooling section

Let me know what you find!

