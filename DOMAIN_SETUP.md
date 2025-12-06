# 🌐 Connect watercooler.world to Vercel

## Step 1: Add Domain in Vercel

1. Go to your Vercel project: https://vercel.com/joinarche-1951s-projects/watercooler
2. Click **"Settings"** tab
3. Click **"Domains"** in the left sidebar
4. Click **"Add Domain"** button
5. Enter: `watercooler.world`
6. Select: **"Connect to an environment"** → **"Production"**
7. Click **"Save"**

Vercel will show you DNS records to add. **Keep this page open!**

---

## Step 2: Configure DNS in Namecheap

### Option A: Use Vercel's DNS (Recommended - Easier)

1. Go to: https://www.namecheap.com
2. Log in → **Domain List** → Click **"Manage"** next to `watercooler.world`
3. Go to **"Advanced DNS"** tab
4. **Delete all existing records** (or disable them)
5. Find **"Nameservers"** section (usually at top)
6. Change from "Namecheap BasicDNS" to **"Custom DNS"**
7. Add Vercel's nameservers (Vercel will show these in the domain setup):
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
8. Click **"Save"**

**Wait 5-10 minutes** for DNS to propagate, then go back to Vercel and click **"Refresh"** on the domain.

---

### Option B: Keep Namecheap DNS (More Control)

If you prefer to keep Namecheap's DNS:

1. Go to Namecheap → **Domain List** → **"Manage"** → **"Advanced DNS"**
2. **Delete all existing A, AAAA, and CNAME records**
3. Add these records (Vercel will show you the exact values):

   **For root domain (watercooler.world):**
   - Type: **A Record**
   - Host: `@`
   - Value: `76.76.21.21` (Vercel's IP - check Vercel for current IP)
   - TTL: Automatic

   **OR use CNAME (if Vercel provides it):**
   - Type: **CNAME Record**
   - Host: `@`
   - Value: `cname.vercel-dns.com.` (Vercel will show exact value)
   - TTL: Automatic

   **For www subdomain (www.watercooler.world):**
   - Type: **CNAME Record**
   - Host: `www`
   - Value: `cname.vercel-dns.com.` (Vercel will show exact value)
   - TTL: Automatic

4. Click **"Save"** (green checkmark)

**Wait 5-10 minutes**, then go back to Vercel and click **"Refresh"**.

---

## Step 3: Update Environment Variables

Once the domain is connected:

1. In Vercel, go to **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_SITE_URL`
3. Click the **pencil icon** to edit
4. Change value to: `https://watercooler.world`
5. Make sure it's checked for: Production, Preview, Development
6. Click **"Save"**

---

## Step 4: Redeploy

After updating the environment variable:

1. Go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## Step 5: Test

1. Visit: `https://watercooler.world`
2. Visit: `https://www.watercooler.world` (should redirect to root)
3. Check that your site loads correctly

---

## Troubleshooting

**Domain not connecting?**
- Wait 10-15 minutes for DNS propagation
- Check DNS records are correct in Namecheap
- Use https://dnschecker.org to verify DNS propagation globally
- Click "Refresh" in Vercel domain settings

**SSL Certificate Issues?**
- Vercel automatically provisions SSL certificates
- Wait 5-10 minutes after domain connects
- If issues persist, check Vercel's domain status page

**Site not loading?**
- Make sure you updated `NEXT_PUBLIC_SITE_URL` environment variable
- Redeploy after updating environment variables
- Check Vercel deployment logs for errors

---

## Quick Reference

**Vercel Domain Settings:**
https://vercel.com/joinarche-1951s-projects/watercooler/settings/domains

**Namecheap DNS:**
https://www.namecheap.com → Domain List → Manage → Advanced DNS

**DNS Checker:**
https://dnschecker.org (to verify DNS propagation)

