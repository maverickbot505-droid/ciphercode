'use client';

import Link from 'next/link';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About CipherCode</title>
      </Head>

      <main className="min-h-screen bg-cipher-bg">
        {/* Hero */}
        <section className="py-20 px-6 border-b border-gray-700/50 text-center">
          <h1 className="hero-text font-bold tracking-tight sm:text-7xl mb-6">About CipherCode</h1>
          <p className="text-xl text-cipher-text-muted max-w-3xl mx-auto fade-in slide-up" style={{animationDelay: '0.1s'}}>
            Ready-made webapp scripts and deployment services for developers who value time over complexity.
          </p>
        </section>

        {/* Mission */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
            
            <div className="card p-8 mb-8 fade-in" style={{animationDelay: '0.2s'}}>
              <p className="text-lg text-cipher-text-muted leading-relaxed">
                CipherCode exists to help developers and businesses get production-ready web applications 
                deployed quickly and securely. We provide pre-built scripts that you can instantly download, 
                or let us handle the deployment so you have a fully functional application in minutes, not weeks.
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-6">What Makes Us Different?</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card p-6">
                <h4 className="font-semibold mb-3">💯 Production-Ready Code</h4>
                <p className="text-sm text-cipher-text-muted">
                  Every script is tested, documented, and ready to deploy. No configuration hell, 
                  no debugging from scratch - just quality code you can use immediately.
                </p>
              </div>

              <div className="card p-6">
                <h4 className="font-semibold mb-3">🔐 Crypto-Only Payments</h4>
                <p className="text-sm text-cipher-text-muted">
                  We accept only cryptocurrency (BTC, ETH, USDT) to protect your privacy and keep 
                  transaction costs low. No banking fees, no identity exposure.
                </p>
              </div>

              <div className="card p-6">
                <h4 className="font-semibold mb-3">☁️ Deployment as a Service</h4>
                <p className="text-sm text-cipher-text-muted">
                  Don't have server infrastructure? No problem! Our deployment service handles 
                  everything - setup, SSL certificates, monitoring, and scaling.
                </p>
              </div>

              <div className="card p-6">
                <h4 className="font-semibold mb-3">🛡️ Security First</h4>
                <p className="text-sm text-cipher-text-muted">
                  Argon2 password hashing, TOTP 2FA for admins, encrypted secrets, audit logging, 
                  and rate limiting protect your data and our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 bg-cipher-bg/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>

            <div className="space-y-6">
              <ValueCard
                icon="🔒"
                title="Privacy & Anonymity"
                description="We never collect your IP addresses or user agent data. Your email and Telegram handle 
                are automatically deleted 30 days after order completion. No customer accounts - just 
                secure order tracking with unique tokens."
              />

              <ValueCard
                icon="⚡"
                title="Speed & Efficiency"
                description="Get your project running in minutes, not weeks. Our scripts are production-ready 
                out of the box. Optional deployment service means you don't need to configure servers, 
                databases, or SSL certificates."
              />

              <ValueCard
                icon="🔒"
                title="Transparency"
                description="Every transaction is verifiable on the blockchain. You see exactly how much 
                crypto is needed, when it expires, and can track your order status anytime with your 
                unique code. No hidden fees or surprises."
              />

              <ValueCard
                icon="🛡️"
                title="Quality & Trust"
                description="Every script undergoes thorough testing before being listed. We provide 
                comprehensive documentation, example configurations, and ongoing support for our 
                deployment service customers."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center card p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-cipher-text-muted mb-8 max-w-2xl mx-auto">
              Browse our catalog and find the perfect webapp for your needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/catalog" className="btn btn-primary">Browse Catalog</Link>
              <Link href="/about#faq" className="btn btn-outline">FAQ</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-cipher-bg/80 border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto text-center text-cipher-text-muted text-sm">
            <p>© {new Date().getFullYear()} CipherCode. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}

// Component: Value Card
function ValueCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-sm text-cipher-text-muted">{description}</p>
      </div>
    </div>
  );
}
