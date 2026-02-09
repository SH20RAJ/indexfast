
import { blogPosts } from '@/lib/blog-data';
import { BlogCard } from '@/components/blog/blog-card';
import { Metadata } from 'next';
import { BackgroundBeams } from '@/components/ui/background-beams';

export const metadata: Metadata = {
  title: 'Blog | IndexFast',
  description: 'Insights on Programmatic SEO, Indexing, and Next.js performance.',
};

export default function BlogPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950">
        <BackgroundBeams className="opacity-20 fixed inset-0 pointer-events-none" />
        
        <div className="relative z-10 container px-4 md:px-6 py-24">
            <div className="max-w-3xl mx-auto text-center mb-24">
                <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full">
                    The IndexFast Blog
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                Mastering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Search Index.</span>
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                Deep dives into Programmatic SEO, Google Indexing API, and building high-performance Next.js applications.
                </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
                ))}
            </div>
        </div>
    </div>
  );
}
