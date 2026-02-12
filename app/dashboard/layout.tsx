import { Sidebar } from "@/components/dashboard/sidebar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { getUserSites } from "@/app/actions/sites";
import baseMetadata from "@/lib/metadata";
import { Metadata } from "next";



export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Dashboard',
  description: 'Manage your Google Search Console properties and track indexing status.',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const sites = await getUserSites();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sites={sites} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-16 lg:pt-8 bg-background">
        {children}
      </main>
    </div>
  );
}
