
import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import { CreativeCard } from "@/components/ui/creative-card";
import SiteDetailsClient from "@/components/site-details-client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function SiteDetailsPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    // Decode domain just in case
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) {
        return notFound();
    }

    const { site, submissions, stats } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/sites" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                     <h1 className="text-3xl font-bold font-handwritten tracking-tight">{site.domain}</h1>
                     <p className="text-muted-foreground text-sm">
                        GSC Property: {site.gscSiteUrl} • Added {formatDistanceToNow(new Date(site.createdAt), { addSuffix: true })}
                     </p>
                </div>
            </div>

            <SiteDetailsClient site={site} stats={stats} />

            <div className="grid gap-6">
                <h2 className="text-xl font-bold font-handwritten">Recent Submissions</h2>
                <CreativeCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground bg-muted/30 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium">URL</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                            No submissions yet. Sync your site to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.map((sub: any) => (
                                        <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs truncate max-w-md" title={sub.url}>
                                                {sub.url}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                                    sub.status >= 200 && sub.status < 300 
                                                        ? "bg-green-500/10 text-green-600" 
                                                        : "bg-red-500/10 text-red-600"
                                                }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CreativeCard>
            </div>
        </div>
    );
}
