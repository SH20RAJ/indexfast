import Link from 'next/link'
import { Zap } from 'lucide-react'
import { CreativeButton } from '@/components/ui/creative-button'

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-20 flex items-center border-b-2 border-zinc-900 bg-white sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-2 group" href="#">
        <div className="bg-zinc-900 text-white p-1 rounded-sm border-2 border-zinc-900 group-hover:bg-white group-hover:text-zinc-900 transition-colors">
            <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-handwritten text-2xl font-bold tracking-tight">IndexFast</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
        <Link className="font-handwritten text-lg hover:underline underline-offset-4" href="#features">
          Features
        </Link>
        <Link className="font-handwritten text-lg hover:underline underline-offset-4" href="#pricing">
          Pricing
        </Link>
        <Link href="/login">
            <CreativeButton variant="secondary" className="h-10 px-4 text-base">
                Sign In
            </CreativeButton>
        </Link>
      </nav>
    </header>
  )
}
