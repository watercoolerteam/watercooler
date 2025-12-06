# 📝 Adding Sample Startups

## Option 1: Use the Script (Easiest)

I've created a script with 8 sample startups. To add them:

```bash
npx tsx scripts/add-sample-startups.ts
```

This will add 8 diverse startups across different categories, stages, and locations - all automatically approved.

**To customize:** Edit `scripts/add-sample-startups.ts` and modify the `sampleStartups` array.

---

## Option 2: Add Through the Form (Manual)

1. Go to: http://localhost:3000/submit
2. Fill out the form with real startup data
3. Submit
4. Go to: http://localhost:3000/admin
5. Approve the submission

**Pros:** Uses the real form, tests the full flow
**Cons:** Takes longer, need to approve each one

---

## Option 3: Use Prisma Studio (Visual)

1. Run: `npx prisma studio`
2. Opens a browser GUI at http://localhost:5555
3. Click "Startup" model
4. Click "Add record"
5. Fill in the fields
6. Set `status` to `APPROVED`
7. Save

**Pros:** Visual, easy to edit
**Cons:** Manual, one at a time

---

## Option 4: Add Real Startups

If you want to add real startups you've found:

1. **Research the startup:**
   - Company name
   - One-liner (their tagline)
   - Description (from their website/about page)
   - Website URL
   - Category
   - Location
   - Founder name(s) (from LinkedIn/about page)
   - Founder email (if available, or use a placeholder)
   - Company stage (Idea/Building/Private Beta/Live)
   - Financial stage (Bootstrapped/Not Raising/Raising Soon/Raising/Funded)

2. **Add via script:**
   - Edit `scripts/add-sample-startups.ts`
   - Add a new object to the `sampleStartups` array
   - Run the script

3. **Or add via form:**
   - Use the submission form
   - Approve in admin panel

---

## Tips for Good Sample Data

- **Diversity:** Mix of categories, locations, stages
- **Realistic:** Use real startup patterns (not obviously fake)
- **Complete:** Fill in all fields for better previews
- **Variety:** Different company stages and financial stages
- **Quality:** Good one-liners and descriptions

---

## After Adding

1. Check the browse page: http://localhost:3000/browse
2. Test filters work with the new data
3. View individual startup pages
4. Test search functionality

---

## Deploying Sample Startups to Production

After adding locally and testing:

```bash
# Commit your changes (if you modified the script)
git add .
git commit -m "Add sample startups script"
git push origin main

# Then run the script on production database
# You'll need to set DATABASE_URL to production
DATABASE_URL="your-production-db-url" npx tsx scripts/add-sample-startups.ts
```

**Or:** Add them through the production form and approve via admin panel.

