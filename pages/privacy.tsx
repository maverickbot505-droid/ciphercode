'use client';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cipher-bg">
      <section className="py-20 px-6 border-b border-gray-700/50 text-center">
        <h1 className="hero-text font-bold tracking-tight sm:text-7xl mb-4">Privacy Policy</h1>
        <p className="text-lg text-cipher-text-muted max-w-xl mx-auto">
          We take your privacy seriously. Here&rsquo;s how we handle your data.
        </p>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="card p-8 space-y-8">
          <Section title="1. Introduction" content={
            "CipherCode ('we', 'our', or 'us') operates the CipherCode website and services. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our site."
          }} />

          <Section title="2. Information We Collect" content={
            "<strong>Minimal Data Collection:</strong> We intentionally collect minimal data to protect your privacy:<ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li><strong>Name/Alias:</strong> Display name (can be any pseudonym)</li><li><strong>Email:</strong> For receipts, tracking links, and notifications</li><li><strong>Telegram Handle:</strong> Optional, for optional Telegram notifications only</li></ul>"
          }} />

          <Section title="3. Data Not Collected" content={
            "<strong>We NEVER collect or store:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Your IP address (except for short-term rate limiting)</li><li>Your browser's User-Agent string</li><li>Any identifying information about your computer/device</li><li>Real names or physical addresses</li><li>Credit card or bank account details</li></ul>"
          }} />

          <Section title="4. How We Use Your Information" content={
            "<strong>Purposes for which we use your data:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Send order confirmation emails with QR codes</li><li>Provide tracking links to your order status page</li><li>Send payment verification notifications</li><li>Communicate deployment status (if you purchased deployment service)</li><li>Respond to support requests</li></ul>"
          }} />

          <Section title="5. Data Retention & Deletion" content={
            "<strong>Automatic Deletion Policy:</strong> To protect your privacy, we automatically delete the following data exactly 30 days after order completion:<ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Email address</li><li>Display name/alias</li><li>Telegram handle (if provided)</li><li>IP addresses (short-term cache only)</li></ul>"
          }} />

          <Section title="6. Third-Party Services" content={
            "<strong>External services we use:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li><strong>Email Service:</strong> Resend or SMTP (only for sending notifications)</li><li><strong>S3 Storage:</strong> For storing bundle files and screenshots</li><li><strong>Payment API:</strong> CoinGecko or similar for crypto rate lookups</li></ul>All third-party services process data only as needed to provide their services. We never share customer data with any third party."
          }} />

          <Section title="7. Security Measures" content={
            "<strong>Protecting your information:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>All admin passwords are hashed using Argon2id algorithm</li><li>Database connections use TLS encryption</li><li>Sensitive configuration (wallet addresses, tokens) is encrypted at rest</li><li>Admin portal requires TOTP 2FA for authentication</li><li>Audit logs track all admin actions</li></ul>"
          }} />

          <Section title="8. Your Rights" content={
            "<strong>Data Subject Access Requests:</strong> Although our system is designed to automatically delete your data after 30 days, if you have any questions about what information we hold, please contact us at support@ciphercode.app."
          }} />

          <Section title="9. Children's Privacy" content={
            "Our services are not intended for users under the age of 18. We do not knowingly collect data from children."
          }} />

          <Section title="10. Changes to This Policy" content={
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date at the top of this page."
          }} />

          <Section title="11. Contact Us" content={
            "<strong>For privacy-related concerns, please contact us:</strong><p class='mt-2 font-medium'>Email: privacy@ciphercode.app</p>"
          }} />
        </div>
      </section>

      <footer className="py-12 px-6 bg-cipher-bg/80 border-t border-gray-700/50 text-center">
        <p className="text-cipher-text-muted text-sm">
          © {new Date().getFullYear()} CipherCode. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

// Component: Section
function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="border-b border-gray-700/50 pb-6 last:border-b-0">
      <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
      <p className="text-cipher-text-muted text-sm leading-relaxed">{content}</p>
    </div>
  );
}
