# CipherCode - Project Summary

## What Is CipherCode?

CipherCode is a full-stack web application that sells ready-made webapp scripts with optional deployment services. It uses crypto-only payments, maintains customer anonymity, and provides a professional admin portal for platform management.

## Core Features

### 🛒 Public Storefront
- Landing page with hero, featured projects, how-it-works sections, FAQ
- Catalog with search, category filtering, and sorting
- Project detail pages with gallery, description, tech stack, features
- Anonymous checkout (no accounts required)
- Crypto payment integration (BTC, ETH, USDT variants)
- Server-side QR code generation for payments

### 💳 Payment System
- Accepts: Bitcoin, Ethereum, USDT-TRC20, USDT-ERC20, USDC
- Server-side quote generation with 30-minute expiry
- Transaction hash submission system
- Admin verification queue for payment approval
- Automatic QR codes for each payment method

### 🔐 Security & Anonymity
- No customer accounts or real identities collected
- IP addresses not stored beyond short-term rate limiting
- Email and Telegram handles auto-deleted after 30 days
- Argon2 password hashing
- Encrypted secrets in database
- TOTP 2FA mandatory for admin access

### ☁️ Deployment Service (Optional)
- Queue system for deployment jobs
- Subdomain or custom domain support
- Environment variables configuration
- Deployment status tracking with live updates
- Health checks and monitoring

### 📧 Notification System
- Email notifications via Resend or SMTP
- Telegram alerts for critical events
- Job queue with BullMQ and retry logic
- HTML and plain-text email templates
- Delivery status logging without message bodies

### 👨‍💼 Admin Portal (/admin)
- Dashboard with revenue tracking and recent activity
- Project management (full CRUD with drag-to-reorder)
- Payment verification queue
- Order management and status updates
- Deployment queue and live URL management
- Notification settings (emails + Telegram)
- Site controls (branding, FAQ, legal pages)
- Admin user management
- Audit logging for all actions

## Technology Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS

### Backend
- Next.js API routes (Node.js runtime)
- Prisma ORM with PostgreSQL

### Authentication
- Auth.js with credentials provider
- TOTP 2FA integration

### Services
- BullMQ for job queues
- Nodemailer for email delivery
- Telegram Bot API for notifications
- QR Code library for server-side generation

## File Structure

```
ciphercode/
├── pages/                      # Next.js pages (file-based routing)
│   ├── admin/                  # Admin portal pages
│   │   └── dashboard.tsx       # Main admin dashboard
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── projects/           # Project catalog APIs
│   │   ├── orders/             # Order management
│   │   └── payment/            # Payment processing
│   ├── tracking.tsx            # Order tracking page
│   ├── about.tsx               # About page
│   ├── terms.tsx               # Terms of service
│   ├── privacy.tsx             # Privacy policy
│   └── acceptable-use.tsx      # Acceptable use policy
├── admin/                      # Admin React components
│   ├── Dashboard.tsx           # Dashboard stats
│   ├── Projects.tsx            # Project management UI
│   ├── Verifications.tsx       # Payment verification queue
│   ├── Deployments.tsx         # Deployment tracking
│   ├── Orders.tsx              # Order listing
│   ├── Notifications.tsx       # Notification settings
│   └── Settings.tsx            # Site controls & admin mgmt
├── prisma/                     # Database configuration
│   ├── schema.prisma           # Complete Prisma schema
│   └── seed.js                 # Sample data seeding
├── services/                   # Business logic services
│   ├── notificationService.ts  # Email queue management
│   ├── emailService.ts         # SMTP/Resend email
│   ├── telegramService.ts      # Telegram notifications
│   └── deploymentService.ts    # Deployment job handling
├── api/services/              # API service layer
│   ├── utils/                  # Utility functions
│   └── helpers.ts             # Common utilities
├── auth/                      # Auth configuration
│   └── [...nextauth].ts        # NextAuth provider
├── styles/                    # Global styles
│   └── globals.css            # Tailwind + custom
├── tailwind.config.js         # Tailwind theme config
├── postcss.config.js          # PostCSS setup
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript settings
├── package.json               # Dependencies
├── .env.example               # Environment template
├── README.md                  # Main documentation
├── DEPLOYMENT.md              # Production deployment guide
└── setup-guide.md             # Local setup instructions
```

## Getting Started

### Quick Start (Development)

```bash
cd ciphercode
npm install
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

Visit: http://localhost:3000

Admin login: /login with credentials from seed script

### Production Setup

See `DEPLOYMENT.md` for detailed production deployment instructions.

## Key API Endpoints

### Public APIs (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects/catalog | List all projects with filters |
| GET | /api/projects/[slug] | Get project details |
| POST | /api/orders/create | Create new order |
| POST | /api/payment/checkout | Generate payment quote |
| POST | /api/payment/submit-hash | Submit transaction hash |

### Admin APIs (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/wallets | Add/update payment wallets |
| POST | /api/admin/orders | Update order status |
| GET | /admin/dashboard | View admin dashboard |
| GET | /admin/projects | List all projects |
| POST | /admin/projects/[id] | Update project |

## Database Schema Overview

### Core Models

- **Project** - Webapp scripts with pricing, screenshots, bundle files
- **Order** - Customer orders with status tracking (12 states)
- **Payment** - Payment records with coin/network info
- **Wallet** - Crypto wallet addresses for receiving payments
- **Quote** - Payment quotes with expiry times
- **Deployment** - Deployment jobs with status and logs
- **Notification** - Email/Telegram notifications
- **AdminUser** - Admin accounts with 2FA support
- **AuditLog** - Security audit trail of all actions

### Status Flows

- **Order Status**: PendingPayment → PaymentSubmitted → [Approved|Rejected] → DownloadReady/Cancelled/etc.
- **Payment Status**: PendingVerification → Approved|Rejected
- **Deployment Status**: Queued → Building → Live|Failed|Cancelled

## Environment Variables

### Required
```bash
DATABASE_URL=postgresql://user:pass@host/dbname
AUTH_SECRET=generated-secret-hex-string
JWT_SECRET=generated-jwt-secret
```

### Optional
```bash
RESEND_API_KEY=your_resend_api_key
NODEMAILER_HOST=smtp.example.com
TELEGRAM_BOT_TOKEN=bot_token_here
TELEGRAM_CHAT_ID=-100123456789
S3_ENDPOINT=https://s3.example.com
```

See `.env.example` for full list.

## Security Features

- ✅ Argon2 password hashing
- ✅ TOTP 2FA mandatory for admins
- ✅ Encrypted secrets in database
- ✅ CSRF protection on forms
- ✅ Rate limiting (IP-based)
- ✅ Audit logging for all admin actions
- ✅ Signed download links with expiry
- ✅ CSP and secure headers

## Sample Projects Included

The `prisma/seed.js` script creates 6 sample projects:

1. **E-Commerce Store** - Complete e-commerce solution ($299.99)
2. **Portfolio Template** - Minimalist portfolio site ($49.99)
3. **Blog Platform** - Markdown-based blogging CMS ($199.99)
4. **CRM System** - Customer relationship management ($599.99)
5. **Task Management App** - Kanban board tool ($149.99)
6. **Landing Page Builder** - Drag-drop builder ($249.99)

## Payment Flow

1. Customer selects project and clicks "Buy"
2. Enters name (alias), email, Telegram handle (optional)
3. Chooses: Script only OR Script + Deployment
4. Selects payment method (BTC/ETH/USDT)
5. Server generates crypto amount quote (valid 30 mins)
6. Displays QR code and wallet address
7. Customer sends payment
8. Submits transaction hash to order page
9. Admin verifies payment in verification queue
10. On approval: download link unlocked / deployment queued

## Notification Events

### To Customers (Email)
- Order confirmation with QR codes
- Payment submitted acknowledgment
- Quote expired warning
- Deployment status updates
- Abuse report received

### To Admins (Email + Telegram)
- New order placed
- Transaction hash submitted
- Payment approved/rejected
- Quote expired
- Abuse report received

## License & Legal Pages

All legal pages are included:
- `/terms` - Terms of service
- `/privacy` - Privacy policy  
- `/acceptable-use` - Acceptable use policy

Each project can have custom license types: MIT, GPL-3.0, Commercial, or Custom.

## Support Contacts

- **General:** support@ciphercode.app
- **Abuse Reports:** abuse@ciphercode.app
- **Privacy:** privacy@ciphercode.app

## Contributing

This is a production-ready codebase. For contributions:

1. Fork the repository
2. Create feature branch
3. Update documentation
4. Ensure tests pass
5. Submit pull request

## License

See LICENSE file for project license terms.

---

**CipherCode v1.0.0** - Ready-made webapp scripts & deployment services
