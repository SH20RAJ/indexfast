
import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import { getSitemaps } from "@/app/actions/sitemaps";
import SiteDetailsClient from "@/components/site-details-client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function SiteDetailsPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) {
        return notFound();
    }

    const { site, submissions, stats } = data;

    // Fetch sitemaps for this site
    const sitemapsList = await getSitemaps(site.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/dashboard/sites" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                     <h1 className="text-3xl font-bold font-handwritten tracking-tight">{site.domain}</h1>
                     <p className="text-muted-foreground text-sm">
                        GSC Property: <code className="text-xs px-1 py-0.5 rounded bg-muted">{site.gscSiteUrl}</code> 
                        &nbsp;•&nbsp; Added {formatDistanceToNow(new Date(site.createdAt), { addSuffix: true })}
                     </p>
                </div>
            </div>

            <SiteDetailsClient 
                site={site} 
                stats={stats} 
                initialSitemaps={JSON.parse(JSON.stringify(sitemapsList))}
                submissions={JSON.parse(JSON.stringify(submissions))}
            />
        </div>
    );
}
