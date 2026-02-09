
import { blogPosts } from '@/lib/blog-data';
import { BlogCard } from '@/components/blog/blog-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | IndexFast',
  description: 'Insights on Programmatic SEO, Indexing, and Next.js performance.',
};

export default function BlogPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-handwritten mb-6 text-zinc-900 dark:text-zinc-50">
          The IndexFast Blog
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-handwritten">
          Thoughts on building faster, scanning deeper, and ranking higher.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
