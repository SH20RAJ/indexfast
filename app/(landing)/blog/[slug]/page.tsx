
import { blogPosts, BlogPost } from '@/lib/blog-data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import Script from 'next/script';
import { ContentRenderer } from './content-renderer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | IndexFast Blog`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-typescript.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-jsx.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-json.min.js" strategy="afterInteractive" />

      <article className="relative min-h-screen bg-zinc-950 text-zinc-200">
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
         />
         
         {/* Simple Progress Bar (could ideally be a client component, but keeping it simple) */}
         <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
             <div className="h-full bg-blue-500 w-1/3"></div> {/* Mock progress */}
         </div>

         <div className="container px-4 md:px-6 py-12 md:py-24 max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-400 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Blog
            </Link>
          
            <header className="mb-12 border-b border-zinc-800 pb-12">
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6 font-mono">
                    <span className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Calendar className="w-4 h-4 text-blue-500"/> {post.date}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Clock className="w-4 h-4 text-purple-500"/> 8 min read
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                    {post.title}
                </h1>
                
                <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl">
                    {post.description}
                </p>

                <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Tag className="w-3 h-3 mr-2" />
                    {tag}
                    </span>
                ))}
                </div>
            </header>
          
            <div className="blog-content prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-blue-300 prose-pre:bg-[#2d2d2d] prose-pre:border prose-pre:border-zinc-700">
                <ContentRenderer content={post.content} />
            </div>

            <div className="mt-20 pt-10 border-t border-zinc-800">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{post.author}</h3>
                        <p className="text-zinc-400 text-sm">Founder @ IndexFast. Building tools for the next generation of SEO.</p>
                        <div className="flex gap-4 mt-3">
                             {/* Social links could go here */}
                             <span className="text-xs text-zinc-500 font-mono">@sh20raj</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </article>
    </>
  );
}
