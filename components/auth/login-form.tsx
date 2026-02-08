'use client'

import { createClient } from '@/utils/supabase/client'
import { CreativeButton } from '@/components/ui/creative-button'
import { Loader2, Chrome } from 'lucide-react'
import { useState } from 'react'

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 font-handwritten p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border-2 border-zinc-900 shadow-[8px_8px_0px_0px] shadow-zinc-900">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-center">Welcome Back!</h1>
          <p className="text-zinc-600 text-center text-lg">
            Connect your Google Search Console to get started.
          </p>
          
          <CreativeButton 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full h-14 text-lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-5 w-5" />
            )}
            Continue with Google
          </CreativeButton>
          
          <p className="text-sm text-zinc-500 text-center">
            We only ask for read-only access to verify your sites.
          </p>
        </div>
      </div>
    </div>
  )
}
