import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - IndexFast',
  description: 'Privacy policy for IndexFast.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 font-handwritten text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
      <div className="prose dark:prose-invert font-sans">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as your Google Search Console data when you authenticate.</p>
        <h2>2. How We Use Information</h2>
        <p>We use your information to provide, maintain, and improve our services, specifically to submit your URLs for indexing.</p>
        <h2>3. Data Sharing</h2>
        <p>We do not share your personal information with third parties except as described in this policy.</p>
        <h2>4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
        <h2>5. Contact</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@indexfast.com.</p>
      </div>
    </div>
  )
}
