'use client';

import { useState } from 'react';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Site Controls & Settings</h1>

      {/* Branding Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Branding & Homepage Content</h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <input 
              type="text" 
              defaultValue="CipherCode"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input 
              type="text" 
              defaultValue="Ready-made webapp scripts & deployment services"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input 
              type="text" 
              defaultValue=""
              placeholder="https://example.com/logo.png"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Favicon URL</label>
            <input 
              type="text" 
              defaultValue=""
              placeholder="https://example.com/favicon.ico"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <textarea 
              defaultValue="Instant access to production-ready web applications. Choose, pay with crypto, and deploy in minutes."
              rows={3}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Value Proposition</label>
            <textarea 
              defaultValue="We provide ready-made webapp scripts that you can instantly download and deploy. With optional deployment services, we handle the setup so you get a fully functional application in minutes."
              rows={4}
              className="input"
            />
          </div>
        </div>

        <button 
          onClick={() => {}}
          className="btn btn-primary mt-4"
        >
          Save Branding Settings
        </button>
      </section>

      {/* FAQ Management */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">FAQ Management</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-cipher-text-muted">
            Add, edit, or remove FAQ questions. Questions are displayed in order on the homepage.
          </p>

          <div className="flex gap-4 mb-4">
            <Button variant="primary" onClick={() => {}}>Add FAQ Question</Button>
          </div>

          {/* Existing FAQs */}
          <div className="space-y-3">
            <FAQItem
              question="How do I pay for a script?"
              answer="All payments are crypto-only. During checkout, select your preferred cryptocurrency (BTC, ETH, or USDT), receive our unique payment address and QR code, then send the exact amount after 30 minutes of verification."
            />
            <FAQItem
              question="What's included with each script?"
              answer="Each script includes: complete source code, installation instructions, documentation, license file, and optionally deployment setup with our service."
            />
            <FAQItem
              question="Can I deploy to my own domain?"
              answer="Yes! With the deployment add-on, you can connect either a subdomain or your custom domain. We handle all configuration including environment variables."
            />
          </div>

          <button 
            onClick={() => {}}
            className="btn btn-outline"
          >
            Manage FAQs
          </button>
        </div>
      </section>

      {/* Legal Pages */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Legal Page Management</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Terms of Service Content</label>
            <textarea 
              defaultValue=""
              placeholder="Enter Terms of Service content..."
              rows={6}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Privacy Policy Content</label>
            <textarea 
              defaultValue=""
              placeholder="Enter Privacy Policy content..."
              rows={6}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Acceptable Use Policy Content</label>
            <textarea 
              defaultValue=""
              placeholder="Enter Acceptable Use Policy content. Must include: no malicious software, no fraudulent activities, no illegal content..."
              rows={6}
              className="input"
            />
          </div>

          <button 
            onClick={() => {}}
            className="btn btn-primary"
          >
          Save Legal Pages
          </button>
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Announcement Banner</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-cipher-text-muted">
            Display a banner on the homepage. Leave empty to hide.
          </p>

          <input 
            type="text" 
            defaultValue=""
            placeholder="Announcement message..."
            className="input"
          />

          <select className="w-full px-4 py-3 bg-cipher-bg border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all">
            <option value="">Select notification type...</option>
            <option value="info">Info (Blue)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="error">Error (Red)</option>
          </select>

          <input 
            type="datetime-local" 
            defaultValue=""
            className="input"
            placeholder="Expiry date (leave empty for never)"
          />

          <button 
            onClick={() => {}}
            className="btn btn-primary"
          >
            Save Banner Settings
          </button>
        </div>
      </section>

      {/* Maintenance Mode */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
        
        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
          <div>
            <p className="font-medium">Enable maintenance mode</p>
            <p className="text-sm text-cipher-text-muted">
              Show a custom message while the site is under maintenance
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={false} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipher-primary"></div>
          </label>
        </div>

        {true && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              Maintenance mode will show a custom message to all visitors. Only admins and internal services can access the site during maintenance.
            </p>
          </div>
        )}

        <button 
          onClick={() => {}}
          className="btn btn-primary mt-4"
        >
          Save Maintenance Settings
        </button>
      </section>

      {/* Admin Management */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Admin User Management</h2>
        
        <div className="flex gap-4 mb-6">
          <Button variant="primary" onClick={() => {}}>Invite New Admin</Button>
          <Button variant="secondary" onClick={() => {}}>Export Audit Logs</Button>
        </div>

        <div className="space-y-3">
          <AdminUserCard 
            name="admin@ciphercode.app"
            role="Owner"
            active={true}
          />
          <AdminUserCard 
            name="support@ciphercode.app"
            role="Support"
            active={true}
          />
        </div>

        <button 
          onClick={() => {}}
          className="btn btn-outline mt-4"
        >
          View All Admins
        </button>
      </section>

      {/* Security Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Security & Audit</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-cipher-success/10 rounded-lg border border-green-500/30">
            <span className="text-2xl">🔐</span>
            <div className="flex-1">
              <p className="font-medium text-green-400">Password Hashing</p>
              <p className="text-sm text-cipher-text-muted mt-1">
                All admin passwords are hashed using Argon2id algorithm for maximum security.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <span className="text-2xl">📊</span>
            <div className="flex-1">
              <p className="font-medium text-blue-400">Audit Logging</p>
              <p className="text-sm text-cipher-text-muted mt-1">
                All admin actions are logged with timestamps and details for security tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="font-medium text-purple-400">TOTP 2FA</p>
              <p className="text-sm text-cipher-text-muted mt-1">
                Two-factor authentication is mandatory for all admin accounts using time-based OTP codes.
              </p>
            </div>
          </div>

          <button 
            onClick={() => {}}
            className="btn btn-outline"
          >
            View Audit Log
          </button>
        </div>
      </section>
    </div>
  );
}

// Component: Button
function Button({ 
  variant = 'secondary',
  onClick,
  children
}: { 
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: 'bg-cipher-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-cipher-secondary hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20',
  } as const;

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}

// Component: FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border border-gray-600/50 rounded-lg p-4 bg-gray-700/30">
      <h3 className="font-medium">{question}</h3>
      <p className="text-sm text-cipher-text-muted mt-2">{answer}</p>
    </div>
  );
}

// Component: Admin User Card
function AdminUserCard({ 
  name,
  role,
  active 
}: { 
  name: string;
  role: string;
  active: boolean;
}) {
  const roleColors = {
    Owner: 'bg-yellow-500/20 text-yellow-400',
    Editor: 'bg-blue-500/20 text-blue-400',
    Support: 'bg-green-500/20 text-green-400',
  } as const;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
      <div>
        <p className="font-medium">{name}</p>
        <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
          {role}
        </span>
      </div>
      <div className="flex gap-2">
        {active && (
          <>
            <button 
              onClick={() => {}}
              className="btn btn-outline" style={{padding: '0.5rem 1rem'}}
            >
              Edit
            </button>
            <button 
              onClick={() => {}}
              className="btn bg-red-500/10 text-red-400 hover:bg-red-500/20" style={{padding: '0.5rem 1rem'}}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
