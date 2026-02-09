
import Link from 'next/link';
import { CreativeCard } from '../ui/creative-card';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <CreativeCard 
        rotate={index % 2 === 0 ? 'left' : 'right'} 
        className="h-full hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="font-handwritten text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">
              {post.description}
            </p>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-brand font-medium">
              Read Article <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CreativeCard>
    </Link>
  );
}
