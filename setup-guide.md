# CipherCode Setup Guide

This guide walks you through setting up and deploying the CipherCode webapp store platform.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 14+** database running
- Git for version control

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ciphercode.git
cd ciphercode
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ciphercode_dev?schema=public"

# NextAuth
AUTH_SECRET=$(openssl rand -hex 32)
AUTH_TRUST_HOST="false"

# JWT for API routes  
JWT_SECRET=$(openssl rand -hex 32)

# Email (choose one: Resend or SMTP)
RESEND_API_KEY=""           # Get from resend.com (optional)
NODEMAILER_HOST="smtp.gmail.com"
NODEMAILER_PORT=587
NODEMAILER_USER="your-email@gmail.com"
NODEMAILER_PASSWORD="your-app-password"

# Telegram (optional, for admin notifications)
TELEGRAM_BOT_TOKEN=""       # Get from @BotFather
TELEGRAM_CHAT_ID="-100123456789"  # Get from @userinfobot

# S3 Object Storage (optional - use MinIO or AWS S3)
S3_ENDPOINT=""              # Leave empty for local development
S3_ACCESS_KEY_ID="your-key"
S3_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="ciphercode-assets"
S3_REGION="us-east-1"

# Quote settings
QUOTE_VALIDITY_MINUTES=30
UNDERPAYMENT_TOLERANCE_PERCENT=5

# Wallet cooldown (seconds)
WALLET_COOLDOWN_SECONDS=300
```

### 4. Set Up Database

```bash
# Create migrations and apply them
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed sample data (projects, admin user)
node prisma/seed.js
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Admin Portal Login

The seed script creates a demo admin account:

- **Email:** `admin@ciphercode.app`
- **Password:** `admin123`
- **TOTP Code:** `123456` (for demo only - in production, use authenticator app)

Visit: `/login` or `/login/admin`

## Production Deployment

### Option 1: Vercel + PostgreSQL (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables from `.env.example`
   - Deploy!

3. **Set up PostgreSQL with Vercel Postgres**
   - Create a database in Vercel Postgres
   - Update `DATABASE_URL` in Vercel dashboard
   - Run migrations: `npx prisma migrate deploy`

4. **Configure Email Service**
   - Sign up at [resend.com](https://resend.com) for easy email delivery
   - Or use SMTP provider (SendGrid, Mailgun, etc.)

5. **Set up Telegram Bot (Optional)**
   - Create bot at [@BotFather](https://t.me/BotFather)
   - Get chat ID from [@userinfobot](https://t.me/userinfobot)
   - Update `.env.local` with credentials

### Option 2: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/ciphercode
      - AUTH_SECRET=${AUTH_SECRET}
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=ciphercode
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Build and run:

```bash
docker-compose up -d
```

## API Endpoints Summary

### Public API (No Auth)

- `GET /api/projects/catalog` - List all projects with filters
- `GET /api/projects/[id]` - Get project details
- `POST /api/orders/create` - Create order
- `POST /api/payment/checkout` - Generate payment quote
- `POST /api/payment/submit-hash` - Submit transaction hash

### Admin API (Protected)

- `POST /api/admin/wallets` - Add/update payment wallets
- `POST /api/admin/orders` - Update order status
- `POST /api/admin/projects` - Create project

See individual route files in `/api` folder.

## Security Checklist

Before going live, ensure:

- [ ] Environment variables are never exposed in client code
- [ ] All API routes have proper rate limiting
- [ ] Admin passwords use Argon2 hashing (configured in Prisma)
- [ ] TOTP 2FA is mandatory for admin login
- [ ] HTTPS is enabled (Vercel provides this automatically)
- [ ] CSP headers are configured (in `next.config.js`)
- [ ] S3 credentials are rotated regularly

## Testing Payment Flow

1. Create a test order with small amount ($1)
2. Use testnet for ETH/USDT testing:
   - Replace network in wallet settings to `testnet`
   - Get test tokens from [faucet](https://faucets.chainstack.com/)
3. Submit hash and verify it processes correctly

## Monitoring & Logs

- Check Vercel dashboard for build logs
- Database logs: enable in PostgreSQL configuration
- Application logs: check Vercel Functions or container stdout

## Troubleshooting

### "Connection refused" errors

```bash
# Ensure PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Or use Docker
docker ps | grep postgres
```

### Migrations not applying

```bash
npx prisma migrate reset --force  # Reset and recreate
npx prisma migrate dev --name fix
```

### Email not sending

```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Or use Resend for easier setup
npm install resend
# Update RESEND_API_KEY in .env.local
```

## Getting Help

- **Documentation:** See `/README.md`
- **Email Support:** support@ciphercode.app
- **Abuse Reports:** abuse@ciphercode.app

## License & Legal

This codebase uses:
- Next.js MIT License
- Prisma Apache 2.0 License
- Tailwind CSS MIT License

The sample project data in `prisma/seed.js` is for demonstration only and should be replaced with your actual project listings.
