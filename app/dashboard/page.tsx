import { stackServerApp } from "@/stack/server";
import { redirect } from 'next/navigation'
import { getDashboardData } from "@/app/actions/dashboard";
import SitesManager from '@/components/sites-manager'
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

  // If user has sites, redirect to first site's overview
  if (sites.length > 0) {
    redirect(`/dashboard/sites/${encodeURIComponent(sites[0].domain)}/overview`);
  }

  // Otherwise show onboarding / sites manager
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-handwritten mb-2">Welcome to IndexFast</h1>
          <p className="text-muted-foreground text-lg">Get started by connecting your sites.</p>
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
        <SitesManager initialSites={sites} />
      </section>
    </div>
  )
}
