'use client';

import { useState } from 'react';

export default function Notifications() {
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Notification Settings</h1>

      {/* Email Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Admin Notification Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Admin Email</label>
            <input 
              type="email" 
              defaultValue="admin@ciphercode.app"
              className="input"
              placeholder="Enter admin email for notifications"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Admin Email</label>
            <input 
              type="email" 
              defaultValue=""
              className="input"
              placeholder="Leave empty if no secondary email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Telegram Bot Token</label>
            <input 
              type="text" 
              defaultValue=""
              className="input"
              placeholder="Bot token from @BotFather"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Telegram Chat ID</label>
            <input 
              type="text" 
              defaultValue="-100123456789"
              className="input"
              placeholder="-100123456789"
            />
          </div>

          <button 
            onClick={() => {}}
            className="btn btn-primary"
          >
            Save Settings
          </button>
        </div>
      </section>

      {/* Telegram Configuration */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Telegram Integration</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
            <span className="text-2xl">🤖</span>
            <div className="flex-1">
              <p className="font-medium">Bot Configuration Steps</p>
              <ol className="text-sm text-cipher-text-muted mt-2 list-decimal list-inside space-y-1">
                <li>Send <code>@BotFather newbotcommand</code> to create bot</li>
                <li>Copy the token provided by BotFather</li>
                <li>Start a private chat with your bot</li>
                <li>Get your Chat ID from @userinfobot</li>
              </ol>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-cipher-success/10 rounded-lg border border-green-500/30">
            <span className="text-2xl">📝</span>
            <div className="flex-1">
              <p className="font-medium text-green-400">Security Notice</p>
              <p className="text-sm text-cipher-text-muted mt-1">
                Telegram chat IDs should be stored encrypted in your database. Never expose tokens or chat IDs in client-side code.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {}}
          className="btn btn-outline mt-4"
        >
          Test Telegram Connection
        </button>
      </section>

      {/* Event Toggle Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Event Notification Toggles</h2>
        
        <div className="space-y-4">
          {['new_order', 'payment_submitted', 'payment_approved', 'payment_rejected', 
             'deployment_status_change', 'quote_expired', 'abuse_report_received'].map((event) => (
            <EventToggle key={event} event={event} />
          ))}
        </div>

        <button 
          onClick={() => {}}
          className="btn btn-primary mt-4"
        >
          Save Preferences
        </button>
      </section>

      {/* Test Notification */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Send Test Notification</h2>
        
        <div className="flex items-start gap-6">
          <button 
            onClick={handleTestNotification}
            className="btn btn-primary"
          >
            Send Email Test
          </button>

          <button 
            onClick={handleTestTelegram}
            className="btn btn-secondary"
          >
            Send Telegram Test
          </button>
        </div>

        {testResult === 'success' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400">✓ Test notification sent successfully!</p>
          </div>
        )}

        {testResult === 'error' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">✗ Failed to send test notification</p>
          </div>
        )}

        {testResult === 'idle' && (
          <div className="mt-4 p-4 bg-cipher-text-muted/5 rounded-lg text-sm">
            Use the buttons above to test your email and Telegram notification configurations.
          </div>
        )}
      </section>

      {/* Logging Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Notification Delivery Settings</h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <SettingToggle 
            label="Log delivery status in admin portal" 
            enabled={true}
          />
          <SettingToggle 
            label="Never log message bodies (privacy)" 
            enabled={true}
          />
          <SettingToggle 
            label="Use HTML email templates" 
            enabled={true}
          />
          <SettingToggle 
            label="Enable retry on failure" 
            enabled={true}
            helpText="Exponential backoff: 1s, 2s, 4s, 8s, 16s..."
          />
        </div>
      </section>
    </div>
  );

  function handleTestNotification() {
    // Test email notification logic here
    setTestResult('success');
  }

  function handleTestTelegram() {
    // Test Telegram notification logic here
    setTestResult('success');
  }
}

// Component: Event Toggle
function EventToggle({ event }: { event: string }) {
  const events = {
    'new_order': 'New Order Alerts',
    'payment_submitted': 'Payment Hash Submitted',
    'payment_approved': 'Payment Approved',
    'payment_rejected': 'Payment Rejected',
    'deployment_status_change': 'Deployment Status Changes',
    'quote_expired': 'Quote Expired',
    'abuse_report_received': 'Abuse Report Received',
  } as const;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <span className="font-medium capitalize">{events[event]}</span>
        <p className="text-xs text-cipher-text-muted">Sends notification to admins on this event</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={true} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipher-primary"></div>
      </label>
    </div>
  );
}

// Component: Setting Toggle
function SettingToggle({ 
  label, 
  enabled,
  helpText
}: { 
  label: string; 
  enabled: boolean;
  helpText?: string;
}) {
  return (
    <div className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
      <div className="flex-1">
        <label className="text-sm font-medium">{label}</label>
        {helpText && <p className="text-xs text-cipher-text-muted mt-1">{helpText}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cipher-primary"></div>
      </label>
    </div>
  );
}
