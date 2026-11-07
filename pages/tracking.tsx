'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TrackingPage() {
  const [orderCode, setOrderCode] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [status, setStatus] = useState<'entering' | 'loading' | 'result'>('entering');
  
  return (
    <main className="min-h-screen bg-cipher-bg">
      {/* Hero */}
      <section className="py-20 px-6 border-b border-gray-700/50 text-center">
        <h1 className="text-4xl font-bold mb-4">Track My Order</h1>
        <p className="text-lg text-cipher-text-muted max-w-xl mx-auto">
          Enter your order code to check status, submit transaction hash, and download your project.
        </p>
      </section>

      {/* Tracking Form */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto">
          {status === 'entering' ? (
            <TrackingForm 
              orderCode={orderCode}
              secretToken={secretToken}
              onSubmit={(code, token) => {
                setOrderCode(code);
                setSecretToken(token);
                setStatus('loading');
              }}
            />
          ) : status === 'loading' ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p>Loading order details...</p>
            </div>
          ) : (
            <OrderResult orderCode={orderCode} secretToken={secretToken} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-cipher-bg/80 border-t border-gray-700/50 text-center">
        <p className="text-cipher-text-muted text-sm">
          © {new Date().getFullYear()} CipherCode. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

// Form to enter order code
function TrackingForm({ 
  orderCode,
  secretToken,
  onSubmit
}: { 
  orderCode: string;
  secretToken: string;
  onSubmit: (code: string, token: string) => void;
}) {
  return (
    <div className="card">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(orderCode, secretToken);
      }}>
        <div className="mb-6">
          <label htmlFor="orderCode" className="block text-sm font-medium mb-2">
            Order Code *
          </label>
          <input
            id="orderCode"
            type="text"
            required
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="CODE-ABC123"
            className="input font-mono text-center tracking-widest uppercase"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="secretToken" className="block text-sm font-medium mb-2">
            Secret Access Token *
          </label>
          <input
            id="secretToken"
            type="text"
            required
            value={secretToken}
            onChange={(e) => setSecretToken(e.target.value)}
            placeholder="Enter your 6-digit token..."
            className="input text-center tracking-widest uppercase font-mono"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Track Order
        </button>

        <p className="text-xs text-cipher-text-muted mt-4 text-center">
          Your order code was provided during checkout or in your confirmation email.
        </p>
      </form>
    </div>
  );
}

// Display order details after tracking
function OrderResult({ 
  orderCode,
  secretToken
}: { 
  orderCode: string;
  secretToken: string;
}) {
  const [orderStatus, setOrderStatus] = useState<any>('PendingPayment');
  
  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Order Status</h2>
        <code className="text-lg">{orderCode}</code>
      </div>

      {/* Order Status */}
      <div className="p-4 mb-6 rounded-lg bg-cipher-bg/50 border border-gray-700/50">
        <span className={`status-badge ${
          orderStatus === 'PendingPayment' ? 'status-pending' : ''
        }`}>
          {orderStatus}
        </span>
      </div>

      {/* Project Info */}
      <div className="mb-6 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
        <h3 className="font-medium mb-2">Project</h3>
        <p className="text-cipher-text-muted">E-Commerce Store v1.2.0</p>
      </div>

      {/* Payment Info */}
      {orderStatus !== 'PendingPayment' && (
        <div className="mb-6 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
          <h3 className="font-medium mb-2">Payment</h3>
          <p className="text-cipher-text-muted font-mono text-sm">
            Amount: ₿0.00543210 BTC
          </p>
        </div>
      )}

      {/* Download Links */}
      {orderStatus === 'DownloadReady' || orderStatus === 'Live' ? (
        <div className="mb-6 p-4 bg-cipher-success/10 rounded-lg border border-green-500/30">
          <h3 className="font-medium mb-2 text-green-400">Downloads Available</h3>
          <ul className="space-y-2 text-sm text-cipher-text-muted">
            <li className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <a href="/downloads/script.zip" className="underline hover:text-green-400">
                Download Source Code
              </a>
            </li>
            {orderStatus === 'Live' && (
              <li className="flex items-center gap-2">
                <span className="text-lg">☁️</span>
                <a href="https://app.subdomain.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-400">
                  View Live Application
                </a>
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {/* Hash Submission */}
      {orderStatus === 'PendingPayment' && (
        <div className="mb-6 p-4 bg-cipher-warning/10 rounded-lg border border-yellow-500/30">
          <h3 className="font-medium mb-2 text-yellow-400">Submit Transaction Hash</h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Hash submitted successfully!');
          }}>
            <label htmlFor="hash" className="block text-sm font-medium mb-2">
              Transaction Hash
            </label>
            <input
              id="hash"
              type="text"
              placeholder="bc1qxy..."
              className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white font-mono text-sm placeholder:text-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
            />

            <button type="submit" className="btn btn-outline w-full mt-4">
              Submit Hash
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Email */}
      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
        <h3 className="font-medium mb-2 text-blue-400">Confirmation Email</h3>
        <p className="text-sm text-blue-200/80">
          Check your email inbox for a detailed receipt with QR codes and payment instructions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={() => {
          if (confirm('Return to home page?')) window.location.href = '/';
        }} className="btn btn-outline flex-1">
          ← Back to Home
        </button>
        
        <a href="/" className="btn btn-secondary flex-1">
          Browse Catalog
        </a>
      </div>
    </div>
  );
}
