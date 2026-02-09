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

  const data = await getDashboardData();
  const sites = data?.sites || [];
  const submissions = data?.submissions || [];

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-handwritten mb-2">Dashboard</h1>
          <p className="text-muted-foreground font-handwritten text-lg">Manage your Google Search Console properties.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="text-sm font-medium">{user.primaryEmail}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-end gap-2">
                    <span className="capitalize text-brand font-bold">{data?.user?.plan || 'Free'} Plan</span>
                    <span>•</span>
                    <span>{data?.user?.credits ?? 0} Credits Left</span>
                </div>
            </div>
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
