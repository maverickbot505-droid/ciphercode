# CipherCode - Crypto Webapp Store Platform

A full-stack web application for selling ready-made webapp scripts with crypto-only payments. Customers purchase as guests, and deployment is available as an optional service.

## Features

### For Customers (Public Site)
- 🛒 Browse catalog of webapp scripts with search and filtering
- 📱 Fully responsive, dark-mode friendly design
- 💰 Crypto-only payment support (BTC, ETH, USDT variants)
- 🎯 Server-side QR code generation for payments
- 🔐 Anonymous checkout - no account required
- 📦 Instant access to source code after payment verification
- ☁️ Optional deployment as a service

### For Admins (Admin Portal)
- 🔒 TOTP 2FA + password authentication
- 📊 Dashboard with revenue tracking by coin
- 👥 Role-based access (Owner, Editor, Support)
- 📦 Project CRUD management
- 💳 Payment verification queue
- ☁️ Deployment management and tracking
- 📧 Email + Telegram notifications
- 🔍 Audit logging for all actions

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Node.js runtime
- Prisma ORM
- PostgreSQL database

### Authentication
- Auth.js with credentials provider
- TOTP 2FA via authenticator app

### Payments
- Crypto-only (BTC, ETH, USDT-TRC20, USDT-ERC20, USDC)
- Server-side QR code generation
- Transaction hash verification system

### Notifications
- Email via Resend or SMTP (Nodemailer)
- Telegram Bot API
- Job queue with BullMQ and retries

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd ciphercode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your settings:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ciphercode_dev?schema=public"
   AUTH_SECRET=$(openssl rand -hex 32)
   RESEND_API_KEY=""
   TELEGRAM_BOT_TOKEN=""
   TELEGRAM_CHAT_ID=""
   S3_ENDPOINT=""
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

## Project Structure

```
ciphercode/
├── pages/                    # Next.js pages (file-based routing)
│   ├── admin/               # Admin portal pages
│   │   ├── layout.tsx       # Admin layout with sidebar
│   │   ├── dashboard.tsx    # Admin dashboard
│   │   └── index.ts         # Admin routing index
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── admin/           # Admin-specific APIs
│   │   ├── projects/        # Project catalog APIs
│   │   └── orders/          # Order management APIs
│   ├── login.tsx            # Admin login page
│   └── _app.tsx             # App wrapper
├── admin/                   # React components for admin portal
│   ├── Dashboard.tsx        # Dashboard with stats
│   ├── Projects.tsx         # Project management
│   ├── Verifications.tsx    # Payment verification queue
│   ├── Deployments.tsx      # Deployment tracking
│   ├── Orders.tsx          # Order listing and management
│   ├── Notifications.tsx    # Notification settings
│   └── Settings.tsx         # Site controls and admin management
├── prisma/                  # Database configuration
│   ├── schema.prisma        # Prisma schema with all models
│   └── seed.js              # Database seeding script
├── api/services/            # Business logic services (optional)
├── styles/                  # Global styles
│   └── globals.css          # Tailwind + custom styles
├── auth/                    # Auth configuration
│   └── [...nextauth].ts     # NextAuth provider
├── .env.example             # Environment variables template
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Payment Flow

### 1. Customer Places Order
- Selects a project from catalog
- Enters display name (alias) and email
- Chooses script only or with deployment
- Selects payment method (BTC, ETH, USDT)

### 2. Quote Generation
- Server calculates crypto amount using live rates
- 30-minute quote expiry with countdown timer
- QR code generated server-side

### 3. Payment Submission
- Customer sends exact crypto amount to wallet address
- Submits transaction hash on order page
- Order status: "Payment submitted, awaiting verification"

### 4. Admin Verification
- Admin reviews payment in verification queue
- Can approve, reject, or request more info
- Explorer links for blockchain verification

### 5. Order Completion
- Approved payments unlock downloads
- Deployment orders move to deployment queue
- Customer receives confirmation emails

## Notification System

### Events
- New order placed (admin)
- Payment hash submitted (customer + admin)
- Payment approved/rejected (customer + admin)
- Deployment status changes (customer)
- Quote expired (customer + admin)
- Abuse report received (admin)

### Delivery
- Email via Resend or SMTP with HTML templates
- Telegram for critical alerts
- Retry logic with exponential backoff
- Delivery status logging without message bodies

## Security Features

- Argon2 password hashing
- Encrypted secrets in database
- CSRF protection on forms
- Strict CSP headers
- Secure headers (HSTS, X-Frame-Options)
- Rate limiting (IP-based)
- Audit logging for all admin actions
- TOTP 2FA mandatory for admins
- No IP/UA storage beyond rate limiting

## Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### PostgreSQL Setup
```bash
# Create database
createdb ciphercode_dev

# Run migrations
npx prisma migrate deploy
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth JWT secret | Yes |
| `RESEND_API_KEY` | Resend API key for email | No |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | No |
| `TELEGRAM_CHAT_ID` | Admin Telegram chat ID | No |
| `S3_ENDPOINT` | S3-compatible storage endpoint | No |

## License & Acceptable Use

- All scripts are licensed as specified per project
- No malicious, fraudulent, or illegal content allowed
- Customer identity never exposed in public metadata
- 30-day data retention for customer emails after order completion

## Support

For issues and questions: support@ciphercode.app
