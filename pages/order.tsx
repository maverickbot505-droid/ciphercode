'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function OrderPage() {
  const [step, setStep] = useState(0); // 0-3: Name -> Project Details -> Payment Preview -> Payment
  
  return (
    <main className="min-h-screen bg-cipher-bg">
      {/* Stepper */}
      <section className="py-12 px-6 border-b border-gray-700/50">
        <div className="max-w-3xl mx-auto">
          <div className="stepper">
            {[
              { id: 1, label: 'Your Info', completed: step > 0 },
              { id: 2, label: 'Project Details', completed: step === 2 },
              { id: 3, label: 'Payment Preview', completed: step === 3 },
              { id: 4, label: 'Pay Now', active: true },
            ].map((s) => (
              <div key={s.id} className="stepper-step fade-in" style={{animationDelay: `${(s.id - 1) * 0.1}s`}}>
                {s.active ? '4' : s.completed ? '✓' : s.id.toString()}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-center mt-8">
            Checkout
          </h1>
        </div>
      </section>

      {/* Order Steps */}
      <section className="py-12 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {step === 0 && <NameStep next={() => setStep(1)} />}
          {step === 1 && <ProjectDetailsStep projectSlug={''} next={() => setStep(2)} />}
          {step === 2 && <PaymentPreviewStep next={() => setStep(3)} />}
          {step === 3 && <PaymentStep onBack={() => setStep(2)} />}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-cipher-bg/80 border-t border-gray-700/50">
        <div className="max-w-3xl mx-auto text-center text-cipher-text-muted text-sm">
          <Link href="/" className="hover:text-cipher-primary transition-colors">← Back to Home</Link>
        </div>
      </footer>
    </main>
  );
}

// Step 1: Name Input
function NameStep({ next }: { next: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6">Step 1: Your Information</h2>

      <p className="text-cipher-text-muted mb-6">
        No real name required. You can use an alias email for privacy. This will be used for receipts and order tracking.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Display Name (Alias) *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe (or any alias)"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com (alias email is fine)"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="telegram" className="block text-sm font-medium mb-2">
            Telegram Handle (Optional)
          </label>
          <input
            id="telegram"
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username_without_at_sign"
            className="input"
          />
        </div>
      </div>

      <button onClick={next} className="btn btn-primary mt-8 w-full">
        Continue to Project Details →
      </button>
    </div>
  );
}

// Step 2: Project Details
function ProjectDetailsStep({ projectSlug, next }: { projectSlug: string; next: () => void }) {
  const [orderType, setOrderType] = useState<'script_only' | 'with_deployment'>('script_only');
  const [subdomain, setSubdomain] = useState('');

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6">Step 2: Project Details</h2>

      {/* Selected Project */}
      <div className="p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50 mb-6">
        <h3 className="text-xl font-bold">{projectSlug || 'Select a project first'}</h3>
      </div>

      {/* Order Type */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold mb-3">Order Type</h4>

        <label className="flex items-center gap-4 p-4 border border-gray-700/50 rounded-lg hover:bg-cipher-bg/30 cursor-pointer transition-colors">
          <input
            type="radio"
            name="orderType"
            checked={orderType === 'script_only'}
            onChange={() => setOrderType('script_only')}
            className="text-cipher-primary focus:ring-cipher-primary"
          />
          <div className="flex-1">
            <p className="font-medium">Script Only</p>
            <p className="text-sm text-cipher-text-muted">Receive source code archive immediately after payment verification</p>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-gray-700/50 rounded-lg hover:bg-cipher-bg/30 cursor-pointer transition-colors">
          <input
            type="radio"
            name="orderType"
            checked={orderType === 'with_deployment'}
            onChange={() => setOrderType('with_deployment')}
            className="text-cipher-primary focus:ring-cipher-primary"
          />
          <div className="flex-1">
            <p className="font-medium">Script + Deployment Service</p>
            <p className="text-sm text-cipher-text-muted">We deploy your application to our infrastructure with optional subdomain</p>
          </div>
        </label>
      </div>

      {/* Deployment Settings */}
      {orderType === 'with_deployment' && (
        <div className="space-y-4 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
          <h4 className="font-semibold mb-3">Deployment Preferences</h4>

          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium mb-1">Subdomain (optional)</label>
            <input
              id="subdomain"
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="app.yourbrand.com"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-1">Region</label>
            <select id="region" className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all cursor-pointer">
              <option value="">Auto-select</option>
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="eu-west-1">EU West (Ireland)</option>
            </select>
          </div>

          <div>
            <label htmlFor="envVars" className="block text-sm font-medium mb-1">Environment Variables</label>
            <textarea
              id="envVars"
              placeholder="API_KEY=secret123&#n;DATABASE_URL=postgres://..."
              rows={4}
              className="input font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              id="notes"
              placeholder="Any special requirements..."
              rows={3}
              className="input"
            />
          </div>
        </div>
      )}

      <button onClick={next} className="btn btn-primary mt-8 w-full">
        Continue to Payment Preview →
      </button>
    </div>
  );
}

// Step 3: Payment Preview
function PaymentPreviewStep({ next }: { next: () => void }) {
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6">Step 3: Payment Preview</h2>

      <p className="text-cipher-text-muted mb-8">
        Before you proceed to payment, here&rsquo;s what your project demo looks like. This is just a preview - after purchase, you&rsquo;ll have access to the actual source code and can deploy it yourself or use our service.
      </p>

      <div className="aspect-video bg-cipher-card rounded-lg border border-gray-600/50 flex items-center justify-center mb-8">
        <iframe
          src="https://example.com/demo"
          className="w-full h-full"
          title="Demo Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50 text-sm text-cipher-text-muted">
        <p>This is a sandboxed preview. After purchase, you'll receive the full project with your own credentials.</p>
      </div>

      <button onClick={next} className="btn btn-primary mt-8 w-full">
        Continue to Payment →
      </button>
    </div>
  );
}

// Step 4: Payment
function PaymentStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="payment-section fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center">Payment</h2>

      {/* Order Code */}
      <div className="mb-8 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50 text-center">
        <p className="text-sm text-cipher-text-muted mb-1">Order Code</p>
        <code className="text-xl font-mono font-bold">CODE-{Math.floor(Math.random() * 9000) + 1000}-{Math.floor(Math.random() * 90) + 1}</code>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.005`}
          alt="QR Code"
          className="mb-4"
          style={{ width: '256px', height: '256px' }}
        />
        
        <button 
          onClick={() => {}}
          className="text-cipher-primary hover:text-blue-400 underline text-sm mb-4"
        >
          Copy QR Code
        </button>

        {/* Wallet Info */}
        <div className="p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50 w-full max-w-md">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">₿</span>
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">Bitcoin Wallet Address</p>
              <code className="text-xs break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">Ξ</span>
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">Ethereum Wallet Address</p>
              <code className="text-xs break-all">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>
            </div>
          </div>

          <p className="text-xs text-cipher-warning mb-3">
            ⚠️ Send ONLY to the address shown above. Sending to wrong network or amount will not be processed.
          </p>
        </div>
      </div>

      {/* Amount and Countdown */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
          <div className="text-left">
            <p className="text-sm text-cipher-text-muted mb-1">Amount to Send</p>
            <p className="text-3xl font-bold">₿0.00543210 (BTC)</p>
            <p className="text-xs text-cipher-text-muted mt-1">≈ $300.00 USD</p>
          </div>

          <div className="countdown text-right">
            <div className="countdown-item">{'30:'}</div>
            <div className="countdown-item">{Math.floor(Math.random() * 60 + 1)}:45</div>
            <p className="text-xs text-cipher-text-muted mt-2">Quote expires in</p>
          </div>
        </div>

        <button className="btn btn-outline w-full mb-4">
          Refresh Quote
        </button>
      </div>

      {/* Transaction Hash Form */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-8">
        <label htmlFor="txHash" className="block text-sm font-medium mb-2">
          Transaction Hash (After Sending)
        </label>
        <input
          id="txHash"
          type="text"
          placeholder="Paste your transaction hash here after sending..."
          className="input font-mono text-sm"
        />

        <div className="mt-2 p-3 bg-cipher-warning/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400">
          <p>⚠️ After sending your payment:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Copy the transaction hash from your wallet</li>
            <li>Paste it above and click "Submit Hash"</li>
            <li>Wait for admin verification (typically minutes)</li>
          </ol>
        </div>

        <button type="submit" className="btn btn-outline w-full mt-4">
          Submit Transaction Hash
        </button>
      </form>

      {/* Order Tracking */}
      <div className="p-4 bg-cipher-success/10 rounded-lg border border-green-500/30 mb-6">
        <p className="text-sm text-green-400 font-medium mb-2">Track My Order</p>
        <p className="text-xs text-green-200/80">
          Save this order code and use our tracking page to monitor your order status after payment submission.
        </p>
      </div>

      <Link href="/" onClick={onBack} className="btn btn-outline w-full">
        ← Back to Home
      </Link>
    </div>
  );
}
