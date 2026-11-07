'use client';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cipher-bg">
      <section className="py-20 px-6 border-b border-gray-700/50 text-center">
        <h1 className="hero-text font-bold tracking-tight sm:text-7xl mb-4">Terms of Service</h1>
        <p className="text-lg text-cipher-text-muted max-w-xl mx-auto">
          By using CipherCode services, you agree to these terms.
        </p>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="card p-8 space-y-8">
          <Section title="1. Acceptance of Terms" content={
            "By accessing and using CipherCode services, you accept and agree to be bound by the terms and provision of this agreement."
          } />

          <Section title="2. Cryptocurrency Payments" content={
            "All transactions on CipherCode are conducted exclusively via cryptocurrency (Bitcoin, Ethereum, USDT). We do not accept or process credit cards, bank transfers, PayPal, or any other payment methods. Once a payment is submitted and verified, the transaction is final."
          } />

          <Section title="3. Order Code & Access" content={
            "After completing checkout, you will receive a unique order code that serves as your access key to track order status, submit payment hashes, and download purchased scripts. CipherCode does not create customer accounts - anonymity is built into our system."
          } />

          <Section title="4. Payment Verification" content={
            "All crypto payments must be verified by our team before downloads are unlocked. This verification process typically takes 1-5 minutes but can take longer if there's high transaction volume. During this time, your order status will show as 'PendingVerification'."
          } />

          <Section title="5. License Types" content={
            "Each project has its own license type specified (MIT, GPL-3.0, Commercial, Custom). You agree to comply with the terms of the applicable license. For commercial licenses, you will receive additional documentation specifying permitted uses."
          } />

          <Section title="6. Deployment Service Terms" content={
            "If you purchase the deployment service add-on, you agree that CipherCode will deploy your project to our infrastructure under our domain (or your custom subdomain). You are responsible for providing accurate environment variables and configuration. We reserve the right to refuse deployments that violate our Acceptable Use Policy."
          } />

          <Section title="7. Privacy & Data Retention" content={
            "We adhere to strict data minimization principles. Your email and Telegram handle (if provided) are automatically deleted 30 days after order completion. We do not log, store, or share your IP address, user agent, or any identifying information beyond what's necessary for order processing."
          } />

          <Section title="8. Refunds & Chargebacks" content={
            "Due to the nature of cryptocurrency transactions, refunds are generally not available. If you experience unauthorized transaction attempts (chargeback-like scenarios), please contact our support immediately with transaction hashes on both sides for investigation."
          } />

          <Section title="9. Intellectual Property" content={
            "All source code, documentation, and materials provided through CipherCode are licensed according to the specified license type. You may not claim ownership of CipherCode's proprietary systems, branding, or infrastructure without explicit permission."
          } />

          <Section title="10. Limitation of Liability" content={
            "CipherCode provides services 'as is' without warranty of any kind. We are not liable for any damages arising from use of our services, including but not limited to loss of data, business interruption, or third-party claims. Cryptocurrency transactions are irreversible and we cannot reverse payments once verified."
          } />

          <Section title="11. Changes to Terms" content={
            "We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of new terms."
          } />

          <Section title="12. Governing Law" content={
            "These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions."
          } />

          <Section title="Contact Information" content={
            "Questions about these terms? Contact us at: support@ciphercode.app"
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
