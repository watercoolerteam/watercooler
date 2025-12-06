# 🛠️ Development Workflow

## Making Changes Locally

### 1. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 2. Make Your Changes

Edit files in your codebase:
- `app/` - Pages and API routes
- `components/` - Reusable components
- `lib/` - Utilities and helpers
- `prisma/schema.prisma` - Database schema

### 3. Test Locally

- Test all features before deploying
- Check the browser console for errors
- Test on different screen sizes

### 4. Commit and Push

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add feature: [description]"

# Push to GitHub
git push origin main
```

### 5. Auto-Deploy

Vercel automatically deploys when you push to `main` branch!

- Check deployment status: Vercel Dashboard → Deployments
- Preview URL: Available immediately
- Production: Deploys automatically (if main branch)

---

## Database Changes

If you modify `prisma/schema.prisma`:

### 1. Create Migration Locally

```bash
npx prisma migrate dev --name your_migration_name
```

### 2. Push to Production

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to production
npx prisma migrate deploy
```

Or in Vercel:
- Go to your project → Settings → Environment Variables
- Add a build command that runs migrations (optional)

---

## Preview Deployments

Every push creates a preview deployment:
- Preview URL: `https://watercooler-v2-xxx.vercel.app`
- Test changes before they go to production
- Share preview links for feedback

---

## Best Practices

1. **Test locally first** - Catch errors before deploying
2. **Use descriptive commit messages** - "Fix login bug" not "update"
3. **Check Vercel logs** - If something breaks, check deployment logs
4. **Use preview deployments** - Test on staging before production
5. **Keep environment variables in sync** - Local `.env` should match Vercel

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Test build locally
npm run lint            # Check for errors

# Database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Create migration
npx prisma generate     # Generate Prisma Client

# Git
git status              # Check changes
git diff                # See what changed
git log                 # View commit history

# Vercel
npx vercel              # Deploy preview
npx vercel --prod       # Deploy to production
```

---

## Troubleshooting

**Changes not showing?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check Vercel deployment logs
- Verify environment variables are set

**Build failing?**
- Check Vercel build logs
- Run `npm run build` locally to catch errors
- Verify all dependencies are in `package.json`

**Database issues?**
- Check `DATABASE_URL` is correct
- Run migrations: `npx prisma migrate deploy`
- Check Prisma Client is generated: `npx prisma generate`

