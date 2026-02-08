import Link from 'next/link'

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-zinc-900 bg-zinc-50">
      <p className="font-handwritten text-sm text-zinc-500">
        © 2025 IndexFast. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-6 sm:gap-8">
        <Link className="font-handwritten text-sm hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="font-handwritten text-sm hover:underline underline-offset-4" href="#">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
