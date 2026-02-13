import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - IndexFast',
  description: 'Terms and conditions for using IndexFast.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 font-handwritten text-zinc-900 dark:text-zinc-50">Terms of Service</h1>
      <div className="prose dark:prose-invert font-sans max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using IndexFast (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

        <h2>2. Description of Service</h2>
        <p>IndexFast provides tools for submitting URLs to search engines (Google, Bing, Yandex, etc.) via their respective APIs. We facilitate the indexing process but do not control search engine algorithms or guarantee indexing results.</p>

        <h2>3. User Obligations</h2>
        <p>You agree to:</p>
        <ul>
            <li>Provide accurate and complete information when registering.</li>
            <li>Use the Service only for lawful purposes and in accordance with search engine guidelines.</li>
            <li>Not submit malicious, harmful, or illegal content.</li>
            <li>Maintain the security of your account credentials.</li>
        </ul>

        <h2>4. Subscription and Payments</h2>
        <p>Services are billed on a subscription basis. You agree to pay all fees associated with your chosen plan. Payments are non-refundable except as provided in our Refund Policy.</p>

        <h2>5. Indexing Guarantee & Disclaimer</h2>
        <p>We submit your URLs directly to search engine APIs. However, <strong>we cannot and do not guarantee that your pages will be indexed</strong>. Indexing is at the sole discretion of the search engines (Google, Bing, etc.) based on their quality guidelines and algorithms.</p>

        <h2>6. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, IndexFast shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Service.</p>
        
        <h2>7. Termination</h2>
        <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>

        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will notify you of significant changes by posting the new terms on this site.</p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@indexfast.strivio.world">support@indexfast.strivio.world</a>.</p>
      </div>
    </div>
  )
}
