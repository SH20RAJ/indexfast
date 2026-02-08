
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import SitesManager from '@/components/sites-manager'
import SubmissionsList from '@/components/submissions-list'
import { Metadata } from 'next'
import baseMetadata from '@/lib/metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Dashboard',
  description: 'Manage your Google Search Console properties and track indexing status.',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your Google Search Console properties.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </div>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Sites</h2>
        <SitesManager />
      </section>

      <section className="space-y-4">
        <SubmissionsList />
      </section>
    </div>
  )
}
