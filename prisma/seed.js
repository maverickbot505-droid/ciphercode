const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Seed data for sample projects
async function seed() {
  console.log('Starting database seeding...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Create admin user (Owner role)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@ciphercode.app' },
    update: {},
    create: {
      email: 'admin@ciphercode.app',
      password: hashedPassword,
      totpSecret: '12345678901234567890', // Test TOTP secret (demo only)
      role: 'Owner',
      active: true,
    },
  });

  console.log('✓ Admin user created');

  // Create sample projects
  const projects = [
    {
      title: "E-Commerce Store",
      slug: "e-commerce-store",
      description: "Complete e-commerce solution with cart, checkout, payment integration, and admin dashboard. Perfect for selling physical or digital products.",
      category: "ecommerce",
      tags: ["shopify-alternative", "cart-system", "payment-integration"],
      price: 299.99,
      demoUrl: "https://demo-ciphercode.vercel.app",
      screenshots: ["/screenshots/ecommerce-1.png", "/screenshots/ecommerce-2.png"],
      bundle: "/bundles/e-commerce-store-v1.0.zip",
      license: "MIT",
      version: "1.2.0",
      status: "Published",
      featured: true,
    },
    {
      title: "Portfolio Template",
      slug: "portfolio-template",
      description: "Minimalist portfolio website for creative professionals. Includes project gallery, blog, contact form, and dark/light mode toggle.",
      category: "portfolio",
      tags: ["creative", "minimalist", "responsive"],
      price: 49.99,
      demoUrl: "https://demo-ciphercode.vercel.app/portfolio",
      screenshots: ["/screenshots/portfolio-1.png", "/screenshots/portfolio-2.png"],
      bundle: "/bundles/portfolio-template-v1.0.zip",
      license: "GPL-3.0",
      version: "1.0.0",
      status: "Published",
      featured: true,
    },
    {
      title: "Blog Platform",
      slug: "blog-platform",
      description: "Markdown-based blogging platform with category system, tags, search functionality, and SEO-optimized articles.",
      category: "cms",
      tags: ["markdown", "seo", "static-site"],
      price: 199.99,
      demoUrl: "https://demo-ciphercode.vercel.app/blog",
      screenshots: ["/screenshots/blog-1.png", "/screenshots/blog-2.png"],
      bundle: "/bundles/blog-platform-v1.0.zip",
      license: "MIT",
      version: "2.1.0",
      status: "Published",
      featured: false,
    },
    {
      title: "CRM System",
      slug: "crm-system",
      description: "Customer relationship management system with contact management, pipeline tracking, email integration, and reporting.",
      category: "business",
      tags: ["sales", "contact-management", "pipeline"],
      price: 599.99,
      demoUrl: "https://demo-ciphercode.vercel.app/crm",
      screenshots: ["/screenshots/crm-1.png", "/screenshots/crm-2.png"],
      bundle: "/bundles/crm-system-v1.0.zip",
      license: "Commercial",
      version: "1.5.0",
      status: "Published",
      featured: true,
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      description: "Kanban board task management tool with drag-and-drop, team collaboration, and productivity analytics.",
      category: "productivity",
      tags: ["kanban", "collaboration", "team"],
      price: 149.99,
      demoUrl: "https://demo-ciphercode.vercel.app/tasks",
      screenshots: ["/screenshots/tasks-1.png", "/screenshots/tasks-2.png"],
      bundle: "/bundles/task-management-v1.0.zip",
      license: "MIT",
      version: "1.3.0",
      status: "Published",
      featured: false,
    },
    {
      title: "Landing Page Builder",
      slug: "landing-page-builder",
      description: "Visual drag-and-drop landing page builder with templates, A/B testing, and analytics integration.",
      category: "marketing",
      tags: ["drag-drop", "templates", "analytics"],
      price: 249.99,
      demoUrl: "https://demo-ciphercode.vercel.app/landing",
      screenshots: ["/screenshots/landing-1.png", "/screenshots/landing-2.png"],
      bundle: "/bundles/landing-builder-v1.0.zip",
      license: "Commercial",
      version: "1.8.0",
      status: "Published",
      featured: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...project,
      },
    });
  }

  console.log(`✓ Created ${projects.length} sample projects`);

  // Create wallet for demo
  await prisma.wallet.upsert({
    where: { coin_network: 'btc-mainnet' },
    update: {},
    create: {
      coin: 'btc',
      network: 'mainnet',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ownerId: admin.id,
      active: true,
    },
  });

  console.log('✓ Created BTC wallet');

  await prisma.wallet.upsert({
    where: { coin_network: 'eth-mainnet' },
    update: {},
    create: {
      coin: 'eth',
      network: 'mainnet',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      ownerId: admin.id,
      active: true,
    },
  });

  console.log('✓ Created ETH wallet');

  await prisma.wallet.upsert({
    where: { coin_network: 'usdt-trc20' },
    update: {},
    create: {
      coin: 'usdt',
      network: 'TRC20',
      address: 'TXYZabcdefghij1234567890abcdefghij1234567890abcd',
      ownerId: admin.id,
      active: true,
    },
  });

  console.log('✓ Created USDT-TRC20 wallet');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nDemo Admin Credentials:');
  console.log('Email: admin@ciphercode.app');
  console.log('Password: admin123');
  console.log('TOTP Code: 123456 (for demo only)');

  // Create audit log entry for seeding
  await prisma.auditLog.create({
    data: {
      action: 'database_seeded',
      entity: null,
      details: { seededAt: new Date(), itemCounts: { projects: projects.length } },
      adminId: admin.id,
      ipAddress: '127.0.0.1',
      userAgent: 'prisma-seed-script',
    },
  });

}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
