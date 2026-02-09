import { stackServerApp } from "@/stack/server";
import { redirect } from 'next/navigation'
import { getDashboardData } from "@/app/actions/dashboard";

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
  const user = await stackServerApp.getUser();

  if (!user) {
    return redirect('/login')
  }

  const { sites, submissions } = await getDashboardData() || { sites: [], submissions: [] };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-handwritten mb-2">Dashboard</h1>
          <p className="text-muted-foreground font-handwritten text-lg">Manage your Google Search Console properties.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.primaryEmail}</span>
        </div>
      </div>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-handwritten">Your Sites</h2>
        <SitesManager initialSites={sites} />
      </section>

      <section className="space-y-4">
        <SubmissionsList initialSubmissions={submissions} />
      </section>
    </div>
  )
}
