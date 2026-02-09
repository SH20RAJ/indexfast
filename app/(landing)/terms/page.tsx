import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - IndexFast',
  description: 'Terms and conditions for using IndexFast.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 font-handwritten text-zinc-900 dark:text-zinc-50">Terms of Service</h1>
      <div className="prose dark:prose-invert font-sans">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Introduction</h2>
        <p>Welcome to IndexFast. By using our website and services, you agree to these Terms of Service.</p>
        <h2>2. Use of Service</h2>
        <p>You agree to use IndexFast only for lawful purposes and in accordance with these Terms.</p>
        <h2>3. Indexing Guarantee</h2>
        <p>While we submit your URLs to search engines via valid APIs, we cannot guarantee indexing as it is ultimately up to the search engines.</p>
        <h2>4. Refunds</h2>
        <p>We offer a 7-day money-back guarantee if you are not satisfied with our service.</p>
        <h2>5. Contact</h2>
        <p>For any questions, please contact us at support@indexfast.com.</p>
      </div>
    </div>
  )
}
