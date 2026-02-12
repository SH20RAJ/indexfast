import { redirect } from "next/navigation";

// Redirect /dashboard/sites/[domain] → /dashboard/sites/[domain]/overview
export default async function SiteDomainPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;
    redirect(`/dashboard/sites/${domain}/overview`);
}
