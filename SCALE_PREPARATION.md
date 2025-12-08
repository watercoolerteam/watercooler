# Scale Preparation Guide

This document outlines the improvements made to prepare Watercooler for scale, and additional recommendations for when you start marketing.

## ✅ Implemented Improvements

### 1. Rate Limiting
**Status: ✅ Complete**

- **Submission endpoint**: 5 submissions per hour per IP
- **Upload endpoint**: 10 uploads per hour per IP  
- **View tracking**: 100 views per hour per IP per startup

**Implementation**: In-memory rate limiting (see `lib/rate-limit.ts`)
- Works well for moderate traffic
- For high scale (1000+ concurrent users), consider upgrading to Redis-based solution (Upstash, Vercel KV)

**Upgrade Path**: When you need distributed rate limiting:
```bash
npm install @upstash/ratelimit @upstash/redis
```

### 2. Duplicate Detection
**Status: ✅ Complete**

- Prevents same email from submitting the same startup multiple times
- Checks for pending/approved duplicates
- Fuzzy matching to catch similar names (e.g., "My Startup" vs "My Startup Inc")

**How it works**:
- Exact match: Same email + same name (case-insensitive)
- Similar match: Same email + similar name pattern

### 3. Input Sanitization
**Status: ✅ Complete**

- All string inputs are sanitized to prevent XSS attacks
- URLs are validated (only http/https allowed)
- Emails are validated and normalized
- HTML tags and script tags are removed

**Implementation**: See `lib/sanitize.ts`

### 4. Prisma Connection Optimization
**Status: ✅ Complete**

- Added proper logging configuration
- Added graceful shutdown handling
- Connection pooling handled by Supabase connection string

### 5. View Tracking Protection
**Status: ✅ Complete**

- Rate limited to prevent view count manipulation
- Fails gracefully if rate limited (returns current count without incrementing)

---

## 🚨 Critical Issues to Address Before Marketing

### 1. **Database Connection Pooling** (High Priority)
**Current**: Basic Prisma setup
**Issue**: At scale, you may hit connection limits

**Solution**: 
- Supabase connection pooling is already configured via connection string
- Monitor connection usage in Supabase dashboard
- Consider using Supabase's connection pooler if you see connection errors

### 2. **Error Monitoring** (High Priority)
**Current**: Console logging only
**Issue**: Hard to debug issues in production

**Recommended**: Set up Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 3. **Email Queue System** (Medium Priority)
**Current**: Emails sent synchronously
**Issue**: Slow submissions if email service is down

**Recommended**: Use a queue system (Vercel Queue, Inngest, or similar)
- Makes submissions faster
- Retries failed emails automatically
- Better user experience

### 4. **Caching** (Medium Priority)
**Current**: Every request hits the database
**Issue**: Slow response times at scale

**Recommended**: 
- Add Next.js caching for browse page
- Cache startup profiles (revalidate every 5 minutes)
- Use Vercel's edge caching

**Quick Win**: Add to browse page:
```typescript
export const revalidate = 300; // 5 minutes
```

### 5. **Database Indexes** (Check)
**Current**: Basic indexes exist
**Action**: Verify all common queries are indexed

**Check these queries**:
- ✅ `status` - indexed
- ✅ `slug` - indexed  
- ✅ `founderEmail` - indexed
- ✅ `category` - indexed
- ✅ `companyStage` - indexed
- ✅ `financialStage` - indexed

**Consider adding**:
- Composite index on `(status, createdAt)` for browse page sorting
- Full-text search index if you want better search

### 6. **Admin Authentication** (High Priority)
**Current**: Password-based (check your implementation)
**Issue**: Security risk if not properly secured

**Recommended**: 
- Use NextAuth.js or similar
- Add 2FA for admin accounts
- Rate limit admin endpoints

### 7. **Backup Strategy** (High Priority)
**Current**: Unknown
**Action**: Set up automated backups

**Supabase**: 
- Free tier includes daily backups
- Consider upgrading for more frequent backups
- Test restore process

### 8. **Monitoring & Alerts** (Medium Priority)
**Recommended Metrics to Track**:
- Submission rate (submissions per hour)
- Approval rate
- Error rate
- Response times
- Database connection pool usage
- Email delivery rate

**Tools**:
- Vercel Analytics (built-in)
- Supabase Dashboard (database metrics)
- Sentry (error tracking)
- Uptime monitoring (UptimeRobot, Better Uptime)

---

## 📊 Performance Optimizations

### Already Implemented ✅
- Pagination on browse page (12 items per page)
- Image optimization (Sharp, WebP conversion)
- Database indexes on common fields

### Recommended Next Steps

1. **Add Response Caching**
   ```typescript
   // In browse/page.tsx
   export const revalidate = 300; // Cache for 5 minutes
   ```

2. **Optimize Database Queries**
   - Use `select` to only fetch needed fields (already doing this)
   - Consider adding database views for complex queries

3. **Image CDN**
   - Supabase Storage already acts as CDN
   - Consider Cloudflare Images for additional optimization

4. **Edge Functions**
   - Move view tracking to edge function for faster response
   - Use Vercel Edge Config for frequently accessed data

---

## 🔒 Security Checklist

### ✅ Completed
- [x] Input validation (Zod)
- [x] Input sanitization
- [x] Rate limiting on API routes
- [x] SQL injection protection (Prisma)
- [x] XSS protection (sanitization)

### ⚠️ To Do
- [ ] CSRF protection (Next.js has built-in, verify it's enabled)
- [ ] Security headers (add to `next.config.ts`)
- [ ] Admin authentication (verify current implementation)
- [ ] API key rotation strategy
- [ ] Regular dependency updates

**Add Security Headers**:
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## 🚀 Scaling Strategy

### Phase 1: 0-100 submissions/day (Current)
**Status**: ✅ Ready
- Current setup handles this easily
- No changes needed

### Phase 2: 100-500 submissions/day
**Actions**:
- Monitor error rates
- Set up Sentry
- Add caching (see above)
- Monitor database performance

### Phase 3: 500-2000 submissions/day
**Actions**:
- Upgrade to Redis-based rate limiting
- Implement email queue system
- Add database read replicas (if needed)
- Consider CDN for static assets

### Phase 4: 2000+ submissions/day
**Actions**:
- Full-text search (Algolia, Typesense, or PostgreSQL full-text)
- Database sharding (if needed)
- Microservices for heavy operations
- Load balancing

---

## 📝 Pre-Launch Checklist

Before you start marketing, verify:

- [ ] All environment variables set in production
- [ ] Database backups configured
- [ ] Error monitoring set up (Sentry)
- [ ] Rate limiting tested
- [ ] Duplicate detection tested
- [ ] Email delivery tested
- [ ] Admin authentication secure
- [ ] Security headers added
- [ ] Performance tested (load test with 100+ concurrent users)
- [ ] Monitoring dashboards set up
- [ ] Alert notifications configured

---

## 🧪 Testing Recommendations

### Load Testing
Use a tool like k6, Artillery, or Locust to test:
- 100 concurrent submissions
- 1000 concurrent browse page views
- Database connection limits

### Example k6 Test:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function() {
  const res = http.get('https://yourdomain.com/browse');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## 📞 Support & Maintenance

### Daily Monitoring
- Check error logs
- Monitor submission rate
- Check email delivery

### Weekly Tasks
- Review rejected submissions
- Check database performance
- Review security logs

### Monthly Tasks
- Update dependencies
- Review and optimize slow queries
- Backup verification
- Security audit

---

## 🎯 Success Metrics

Track these metrics to measure success:

1. **Submission Metrics**
   - Submissions per day
   - Approval rate
   - Rejection rate (and reasons)

2. **Engagement Metrics**
   - Browse page views
   - Startup profile views
   - Search queries

3. **Performance Metrics**
   - Average response time
   - Error rate
   - Uptime

4. **Business Metrics**
   - Total approved startups
   - Categories distribution
   - Geographic distribution

---

## 💡 Quick Wins (Do These First)

1. **Add Sentry** (30 minutes)
   - Critical for debugging production issues

2. **Add Response Caching** (15 minutes)
   - Significantly improves browse page performance

3. **Add Security Headers** (10 minutes)
   - Quick security improvement

4. **Set Up Monitoring Alerts** (30 minutes)
   - Get notified of issues immediately

5. **Load Test** (1 hour)
   - Identify bottlenecks before launch

---

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**Last Updated**: After implementing scale preparation improvements
**Next Review**: Before marketing launch
