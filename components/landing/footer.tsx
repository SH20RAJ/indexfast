import Link from 'next/link'

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <p className="font-handwritten text-sm text-zinc-500 dark:text-zinc-400">
        © 2026 IndexFast. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-6 sm:gap-8">
        <Link className="font-handwritten text-sm hover:underline underline-offset-4 text-zinc-900 dark:text-zinc-100" href="#">
          Terms of Service
        </Link>
        <Link className="font-handwritten text-sm hover:underline underline-offset-4 text-zinc-900 dark:text-zinc-100" href="#">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
