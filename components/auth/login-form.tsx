"use client";

import { useStackApp } from "@stackframe/stack";
import Link from 'next/link';

export function LoginForm() {
  const app = useStackApp();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-handwritten">
            Sign in to IndexFast
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Or <a href={app.urls.signUp} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">start your free trial</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-200 dark:border-zinc-800">
             <div className="flex flex-col gap-4">
                <Link 
                  href={app.urls.signIn}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign in with Stack Auth
                </Link>
             </div>
        </div>
      </div>
    </div>
  );
}
