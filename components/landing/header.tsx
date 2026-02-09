"use client";

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { CreativeButton } from '@/components/ui/creative-button'
import { useUser } from '@stackframe/stack'

export function Header() {
  const user = useUser();

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center border-b-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950 sticky top-0 z-50 transition-colors duration-300">
      <Link className="flex items-center justify-center gap-2 group" href="/">
        <div className="bg-zinc-900 text-white p-1 rounded-sm border-2 border-zinc-900 group-hover:bg-white group-hover:text-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white dark:group-hover:bg-zinc-900 dark:group-hover:text-white transition-colors">
            <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-handwritten text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">IndexFast</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
        <Link className="font-handwritten text-lg hover:underline underline-offset-4 text-zinc-900 dark:text-zinc-100" href="/#features">
          Features
        </Link>
        <Link className="font-handwritten text-lg hover:underline underline-offset-4 text-zinc-900 dark:text-zinc-100" href="/pricing">
          Pricing
        </Link>
        {user ? (
            <Link href="/dashboard">
                <CreativeButton className="h-10 px-4 text-base bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900">
                    Dashboard
                </CreativeButton>
            </Link>
        ) : (
            <Link href="/login">
                <CreativeButton variant="secondary" className="h-10 px-4 text-base bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-zinc-500 dark:shadow-white">
                    Sign In
                </CreativeButton>
            </Link>
        )}
      </nav>
    </header>
  )
}
