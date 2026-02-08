
'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/webmasters.readonly email',
      },
    })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">IndexFast</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your Google Search Console to automate IndexNow submissions.
        </p>
        <Button 
          size="lg" 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
