'use client';

export default function AcceptableUsePage() {
  return (
    <main className="min-h-screen bg-cipher-bg">
      <section className="py-20 px-6 border-b border-gray-700/50 text-center">
        <h1 className="hero-text font-bold tracking-tight sm:text-7xl mb-4">Acceptable Use Policy</h1>
        <p className="text-lg text-cipher-text-muted max-w-xl mx-auto">
          Rules for using CipherCode services and listing projects.
        </p>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="card p-8 space-y-8">
          <Section title="1. Overview" content={
            "CipherCode provides a platform for distributing web application scripts and deployment services. To ensure our platform remains safe, legal, and trustworthy for everyone, we enforce this Acceptable Use Policy."
          }} />

          <Section title="2. Prohibited Content" content={
            "<strong>YOU MUST NOT upload, sell, or distribute any software that:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Is malware, viruses, trojans, or any form of malicious code</li><li>Stole from or violates intellectual property rights</li><li>Enables unauthorized access to computer systems (hacking tools)</li><li>Surveys, monitors, or tracks users without consent (spyware/keyloggers)</li><li>Encrypts files for ransom (ransomware)</li><li>Steals credentials, API keys, or private data</li><li>Bypasses security controls (brute force tools, credential dumpers)</li><li>Targets critical infrastructure (power grids, hospitals, utilities)</li><li>Is designed to evade detection by security software</li></ul>"
          }} />

          <Section title="3. Illegal Activities" content={
            "<strong>We will not assist with illegal activities:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Cryptocurrency scams, fraud, or money laundering</li><li>Money mule schemes or criminal payment processing</li><li>Fake websites or phishing kits</li><li>Doxing tools or personal data extraction software</li><li>Gambling or betting scripts not properly licensed</li><li>Drug sales or illegal marketplace platforms</li><li>Weapons, drugs, or other restricted items</li></ul>"
          }} />

          <Section title="4. Deceptive Practices" content={
            "<strong>Prohibited deceptive practices:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>False claims about software capabilities</li><li>Misleading descriptions or screenshots</li><li>Hidden costs or fees not disclosed in pricing</li><li>Impersonating other companies or organizations</li><li>Promising guaranteed results (e.g., 'guaranteed rank #1 on Google')</li></ul>"
          }} />

          <Section title="5. Project Review Process" content={
            "<strong>All projects require admin review before publishing:</strong><ol class='list-decimal list-inside mt-3 space-y-2 text-sm'><li>When you upload a project, it&rsquo;s marked as &lsquo;Draft&rsquo; and hidden</li><li>Our team reviews the code for prohibited content</li><li>We verify license type is properly specified</li><li>Once approved, projects are published and visible to customers</li></ol>If a project fails review, you will receive a rejection notification with reasons."
          }} />

          <Section title="6. Customer Acceptable Use" content={
            "<strong>By purchasing a CipherCode script, you agree:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>To use the software only for its intended purpose</li><li>To comply with the license terms (MIT, GPL, Commercial, etc.)</li><li>To not resell source code to third parties without permission</li><li>To report any security vulnerabilities we can fix</li><li>To respect user privacy and data protection laws in your jurisdiction</li></ul>"
          }} />

          <Section title="7. Abuse Reporting" content={
            "<strong>Report suspicious activity:</strong> If you believe a project violates our Acceptable Use Policy or is being used for illegal purposes, please report it:<ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li><strong>Email:</strong> abuse@ciphercode.app</li><li><strong>Include:</strong> Project title, URL (if available), and specific concerns</li></ul>We will investigate all reports promptly. Reported projects may be removed from our catalog."
          }} />

          <Section title="8. Consequences of Violation" content={
            "<strong>If you violate this policy, we may:</strong><ul class='list-disc list-inside mt-3 space-y-1 text-sm'><li>Remove the project from our platform</li><li>Suspend or terminate your access to download/purchase</li><li>Report illegal activities to appropriate authorities</li><li>Seek legal action for damages</li></ul>"
          }} />

          <Section title="9. Law Enforcement Requests" content={
            "In cases of suspected criminal activity, CipherCode may comply with lawful requests from law enforcement agencies providing reasonable assurance of good faith cooperation."
          }} />

          <Section title="10. Policy Updates" content={
            "We reserve the right to update this Acceptable Use Policy at any time. Changes will be posted on this page and reflected in our Terms of Service updates."
          }} />

          <Section title="Questions?" content={
            "<strong>Need clarification about what&rsquo;s allowed?</strong><p class='mt-2 font-medium'>Contact us: support@ciphercode.app</p>"
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
