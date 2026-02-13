import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - IndexFast',
  description: 'Privacy policy for IndexFast.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 font-handwritten text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
      <div className="prose dark:prose-invert font-sans max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>IndexFast (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.</p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information</h3>
        <p>We collect information you provide directly to us, such as:</p>
        <ul>
            <li>Name and email address when you register.</li>
            <li>Payment information (processed securely by our payment providers).</li>
            <li>Google Search Console data (URLs, site verification status) when you connect your account.</li>
        </ul>
        
        <h3>2.2 Usage Data</h3>
        <p>We automatically collect certain information when you access our Service, including your IP address, browser type, device information, and usage patterns.</p>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Provide, operate, and maintain our Service.</li>
            <li>Process transactions and manage your subscription.</li>
            <li>Submit your URLs to search engines on your behalf.</li>
            <li>Send you administrative notices, updates, and support messages.</li>
            <li>Analyze usage patterns to improve our Service.</li>
        </ul>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal data. We share information only in the following circumstances:</p>
        <ul>
            <li><strong>Service Providers:</strong> With third-party vendors (e.g., payment processors, hosting services) who need access to perform services for us.</li>
            <li><strong>Search Engines:</strong> Your URLs are submitted to search engines (Google, Bing, etc.) as part of the core Service function.</li>
            <li><strong>Legal Compliance:</strong> If required by law or to protect our rights or the safety of others.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>We retain your personal information only for as long as necessary to provide the Service and fulfill the purposes outlined in this policy. You can request deletion of your data at any time.</p>

        <h2>6. Security</h2>
        <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        
        <h2>7. Cookies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information to improve your experience.</p>

        <h2>8. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information. You can manage your account settings or contact us for assistance.</p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@indexfast.strivio.world">privacy@indexfast.strivio.world</a>.</p>
      </div>
    </div>
  )
}
