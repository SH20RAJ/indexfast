import Link from 'next/link'

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
        © 2026 IndexFast. Part of <a href="https://unstory.app/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4">Unstory</a>
      </p>
      <nav className="sm:ml-auto flex gap-6 sm:gap-8">
        <Link className="text-xs hover:underline underline-offset-4" href="/terms">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
