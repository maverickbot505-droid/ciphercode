# CipherCode - Quick Start Guide

Get CipherCode running in under 10 minutes.

## Prerequisites Check

```bash
# Node.js version check
node --version
# Should show: v18.x.x or higher

# npm version check  
npm --version
# Should show: 9.x.x or higher
```

## One-Command Setup

If you have Docker installed, use this script:

```bash
docker run -p 3000:3000 -v "$(pwd):/app" node:18-alpine bash -c "cd /app && npm install && npx prisma migrate dev --name init && node /app/prisma/seed.js && npm run dev"
```

Or manually (without Docker):

## Step 1: Install Dependencies

```bash
cd ciphercode
npm install
```

Expected output: `added XXX packages in YZs`

## Step 2: Set Up Database

```bash
# Create migrations and generate Prisma client
npx prisma migrate dev --name init

# Seed database with sample data
node prisma/seed.js
```

Expected output shows admin credentials at the end:
```
Demo Admin Credentials:
Email: admin@ciphercode.app
Password: admin123
TOTP Code: 123456 (for demo only)
```

## Step 3: Start Development Server

```bash
npm run dev
```

Expected output shows URLs. Visit the local URL shown.

## Step 4: Open in Browser

Visit: `http://localhost:3000`

You'll see the CipherCode homepage with:
- ✅ Hero section
- ✅ Featured projects grid
- ✅ How it works steps
- ✅ FAQ accordion

## Quick Actions

### Browse Projects

```bash
# View catalog page
open http://localhost:3000/catalog
```

### Create Test Order

```bash
# Go to checkout (you'll be prompted to select a project first)
open http://localhost:3000/order
```

### Login to Admin Portal

```bash
# Auto-login demo or manual login
open http://localhost:3000/login
```

Use the demo credentials shown in the seed output.

## What Works Right Away

✅ **Browse catalog** - See all 6 sample projects with pricing and features  
✅ **View project details** - Full descriptions, tech stack, screenshots  
✅ **Start checkout flow** - Complete 4-step order process  
✅ **Payment preview** - See crypto amounts, QR codes (demo)  
✅ **Admin login** - Access dashboard with demo credentials  
✅ **Project management UI** - Create/edit projects (data stored in DB)  
✅ **Order management** - View orders table with filtering  

## What Needs Configuration

⚠️ **Email notifications** - Set up SMTP or Resend API key  
⚠️ **Payment wallets** - Add your crypto wallet addresses in admin  
⚠️ **Telegram alerts** - Configure bot token and chat ID  
⚠️ **S3 object storage** - Configure for production deployment  

These can be added later without breaking functionality.

## Testing the Flow

### 1. Browse to Catalog
Visit `/catalog` and see all projects

### 2. View Project Details
Click any project to see full description

### 3. Start Order (Demo Only)
- Go to `/order`
- Fill out form with test data
- Note: Actual payment won't be processed without real wallet setup

### 4. Admin Dashboard
- Login at `/login`
- View revenue stats, recent orders
- Add crypto wallets for testing

## Common Issues & Solutions

### "Cannot find module '@prisma/client'"

```bash
# Reinstall dependencies
npm install
# And regenerate Prisma client
npx prisma generate
```

### Database migration errors

```bash
# Reset and try again
rm -rf prisma/migrations
npx prisma migrate reset
npx prisma migrate dev --name init
```

### "Connection refused" on database

Ensure PostgreSQL is running:

```bash
# Check PostgreSQL service
sudo systemctl status postgresql  # Linux
# Or check Docker containers
docker ps
```

## Next Steps After Basic Setup

1. **Add your payment wallets** in admin portal
2. **Configure email service** for notifications  
3. **Test order flow** end-to-end
4. **Customize branding** in settings page
5. **Deploy to production** using DEPLOYMENT.md

## Production Deployment Quick Path

```bash
# Build optimized version
npm run build

# Deploy to Vercel
npx vercel --prod
```

Then configure environment variables on Vercel dashboard.

## Getting Help

- See README.md for full documentation
- See setup-guide.md for detailed setup
- See DEPLOYMENT.md for production deployment
- Email: support@ciphercode.app

---

That's it! You're up and running in minutes. 🚀
