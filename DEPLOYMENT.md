# CipherCode Deployment Documentation

This document covers deploying CipherCode to production environments.

## Production Requirements

### Minimum Requirements

- PostgreSQL 14+ (production database)
- Node.js 18+ runtime
- S3-compatible object storage for bundles/screenshots
- Email service configured (Resend, SMTP provider, or similar)
- HTTPS enabled (Vercel/Cloudflare/AWS Certificate Manager)

### Recommended Infrastructure

- Vercel for hosting (auto-scaling, zero downtime deploys)
- Vercel Postgres for database (managed, serverless)
- MinIO or AWS S3 for object storage
- Resend for email delivery (reliable, good deliverability)

## Step-by-Step Deployment

### 1. Prepare Production Database

```bash
# Option A: Use existing PostgreSQL
createdb ciphercode_prod

# Option B: Use Vercel Postgres
# Set DATABASE_URL in your Vercel dashboard

# Create production migrations
npx prisma migrate deploy
```

### 2. Generate Production Secrets

Create or update `.env.production`:

```bash
# Generate new secrets
openssl rand -hex 32 > auth_secret.txt
openssl rand -hex 32 > jwt_secret.txt
cat auth_secret.txt > .env.production
cat jwt_secret.txt >> .env.production
```

### 3. Configure Object Storage

For AWS S3:

```bash
# Install AWS CLI if needed
pip install awscli-local

# Configure credentials (or use environment variables)
aws configure set default.region us-east-1
aws s3 mb s3://ciphercode-assets --region us-east-1
```

For MinIO or compatible storage, update `S3_ENDPOINT` in environment variables.

### 4. Upload Initial Assets

Copy project bundles and screenshots to S3:

```bash
aws s3 cp ./bundles/s3://ciphercode-assets/bundles/
aws s3 cp ./screenshots/s3://ciphercode-assets/screenshots/
```

Or configure Prisma schema to use local paths initially, migrate to S3 after first deploy.

### 5. Set Up Email Service

**Using Resend (recommended for production):**

1. Sign up at https://resend.com
2. Get API key from dashboard
3. Update `RESEND_API_KEY` in environment variables
4. Verify email by sending test message:

```bash
curl -X POST https://api.resend.com/mail/send \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  --data '{
    "from": "CipherCode <onboarding@resend.dev>",
    "to": ["admin@example.com"],
    "subject": "Test Email",
    "html": "<p>This is a test email from CipherCode.</p>"
  }'
```

**Using SMTP (alternative):**

1. Get SMTP credentials from provider (SendGrid, Mailgun, etc.)
2. Update `NODEMAILER_*` environment variables
3. Test connection using:

```bash
telnet smtp.example.com 587
```

### 6. Set Up Telegram Bot (Optional)

1. Create bot at https://t.me/BotFather
2. Get token from @BotFather
3. Start chat with your bot to get username
4. Get Chat ID from @userinfobot:
   ```
   /start
   # Response will include: {"chat":{"id":-100123456789,"type":"private"}}
   ```

### 7. Configure Domain & SSL

**Vercel (automatic):**

1. Go to Vercel dashboard
2. Settings → Domains
3. Add your domain (e.g., `app.ciphercode.app`)
4. SSL cert is auto-provisioned

**Custom domain:**

1. Update DNS records:
   - `A` record for root: Points to Vercel IP addresses or Cloudflare proxy
   - `CNAME` for www: Points to your Vercel domain
2. Verify in Vercel dashboard
3. SSL auto-renews monthly

### 8. Final Environment Check

Verify all required variables are set:

```bash
# List all env vars (redacted)
cat .env.production | sed 's/password/[REDACTED]/g'

# Required checks
grep -q "DATABASE_URL=" .env.production && echo "✓ Database"
grep -q "AUTH_SECRET=" .env.production && echo "✓ Auth"
grep -q "JWT_SECRET=" .env.production && echo "✓ JWT"
grep -q "RESEND_API_KEY\|NODEMAILER_" .env.production && echo "✓ Email configured"
```

### 9. Deploy to Vercel

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Production deployment"

# Build on Vercel
npx vercel --prod
```

Or use Vercel CLI:

```bash
npx vercel login
npx vercel deploy --prod
```

### 10. Post-Deployment Checklist

- [ ] Test order flow with small amount ($1)
- [ ] Verify payment verification in admin portal
- [ ] Check email notifications arrive correctly
- [ ] Verify Telegram notifications (if configured)
- [ ] Test QR code generation at checkout
- [ ] Verify deployment queue is working
- [ ] Check audit logs in admin portal
- [ ] Test all admin routes with proper authentication

### 11. Monitoring & Maintenance

**Health checks:**

```bash
# Check application health
curl https://yourdomain.com/api/health

# Check database connectivity
npx prisma db pull
```

**Set up monitoring:**

1. Vercel Analytics for traffic monitoring
2. Sentry or similar for error tracking
3. Database slow query logging enabled
4. Set up CloudWatch alerts or similar for critical errors

**Regular maintenance tasks:**

- Rotate API keys quarterly
- Review and clean up old deployment logs
- Monitor disk usage on S3 bucket
- Check SSL certificate expiration (Vercel auto-renews)
- Update dependencies monthly:

```bash
npm audit fix
npx npm-check-updates --upgrade
```

### 12. Rollback Procedure

If issues occur after deploy:

```bash
# Revert to previous commit
git log --oneline | head -5

# Reset and redeploy
git reset --hard HEAD~1
npx vercel deploy --prod
```

## Scaling Considerations

### Database Scaling

- Enable connection pooling (PgBouncer if needed)
- Monitor slow queries with `EXPLAIN ANALYZE`
- Set appropriate indexes on frequently queried fields:
  ```prisma
  Index({ orderCode }) @unique;  // Already in schema
  Index({ status, createdAt }); // For order filtering
  ```

### Queue Scaling (BullMQ)

- Use Redis with cluster for production
- Set up multiple workers for parallel job processing
- Monitor queue depth and job execution time

### S3 Scaling

- Enable lifecycle policies for old bundles/screenshots
- Consider CDN integration for static assets
- Set appropriate storage classes (S3 Glacier for backups)

## Security Hardening

1. **Enable CSP headers:**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" },
        ],
      },
    ];
  },
};
```

2. **Enable HSTS:**

```javascript
headers.push({
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
});
```

3. **Rate limiting:**

Adjust limits in `/api/utils/helpers.ts` as needed for your traffic patterns.

4. **Audit logging:**

Ensure all admin actions are logged to audit log table:

```prisma
model AuditLog {
  // ... existing fields
  @@index([action, createdAt])
}
```

## Troubleshooting Production Issues

### Email not sending

1. Check SMTP credentials (for SMTP method)
2. Verify Resend API key has correct permissions
3. Check email headers for delivery failures
4. Monitor spam folder and whitelist domains

### Payment verification stuck

1. Check admin portal verification queue
2. Review payment logs in admin orders page
3. Verify quote expiry times are reasonable (not too short)
4. Check wallet addresses in database are up-to-date

### Database connection issues

1. Check PostgreSQL status: `pg_isready`
2. Verify DATABASE_URL connection string format
3. Check connection pool settings
4. Review logs for authentication errors

### Object storage errors

1. Verify S3 credentials have write permissions
2. Check bucket exists and is accessible
3. Review CORS settings (for public access)
4. Test direct upload:

```bash
aws s3 cp ./test-bundle.zip s3://ciphercode-assets/test/
```

## Support & Contact

For production issues:

- **Email:** support@ciphercode.app
- **Abuse reports:** abuse@ciphercode.app
- **Status page:** https://status.ciphercode.app (optional)

## License

See LICENSE file in repository for terms.
