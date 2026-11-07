#!/bin/bash

# CipherCode Project Setup Script
# Run this after cloning the repository to get everything running

set -e

echo "🚀 Setting up CipherCode project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

node_version=$(node -v)
echo "✓ Detected Node.js version: $node_version"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables (if not already set)
echo "⚙️  Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local from .env.example"
    echo ""
    echo "⚠️  Please edit .env.local with your actual values:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - AUTH_SECRET (generate: openssl rand -hex 32)"
    echo "   - RESEND_API_KEY (optional, if using Resend for emails)"
    echo "   - TELEGRAM_BOT_TOKEN (optional, for admin notifications)"
    echo ""
    echo "See .env.example for full list of available options."
else
    echo "✓ .env.local already exists"
fi

# Set up database (create migrations)
echo ""
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with sample projects and admin user
echo ""
echo "🌱 Seeding database with sample data..."
node prisma/seed.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual configuration values"
echo "2. Start the development server: npm run dev"
echo "3. Visit http://localhost:3000"
echo ""
echo "Demo Admin Login:"
echo "   Email: admin@ciphercode.app"
echo "   Password: admin123"
echo "   TOTP: 123456 (for demo purposes only)"
echo ""
