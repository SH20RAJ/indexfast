import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import { getSitemaps } from "@/app/actions/sitemaps";
import { CreativeCard } from "@/components/ui/creative-card";
import { formatDistanceToNow } from "date-fns";
import { Check, AlertCircle, MapPin, Send, FileText } from "lucide-react";
import Link from "next/link";
import { OverviewActions } from "./overview-actions";

export default async function SiteOverviewPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain: rawDomain } = await params;
    const domain = decodeURIComponent(rawDomain);
    const data = await getSiteDetails(domain);

    if (!data) return notFound();

    const { site, submissions, stats } = data;
    const sitemapsList = await getSitemaps(site.id);
    const recentSubmissions = submissions.slice(0, 5);

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-handwritten tracking-tight">{site.domain}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    GSC: <code className="text-xs px-1 py-0.5 rounded bg-muted">{site.gscSiteUrl}</code>
                    &nbsp;•&nbsp; Added {formatDistanceToNow(new Date(site.createdAt), { addSuffix: true })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CreativeCard className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</span>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        site.isVerified
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                        {site.isVerified ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        {site.isVerified ? "Verified" : "Unverified"}
                    </div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Monthly Submissions</span>
                    <div className="text-3xl font-bold font-handwritten">{stats.totalSubmissions}</div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sitemaps</span>
                    <div className="text-3xl font-bold font-handwritten">{sitemapsList.length}</div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Auto-Index</span>
                    <OverviewActions site={JSON.parse(JSON.stringify(site))} />
                </CreativeCard>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Link href={`/dashboard/sites/${rawDomain}/submit`}>
                    <CreativeCard className="p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Send className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Submit URLs</p>
                                <p className="text-xs text-muted-foreground">Submit pages to IndexNow</p>
                            </div>
                        </div>
                    </CreativeCard>
                </Link>

                <Link href={`/dashboard/sites/${rawDomain}/sitemaps`}>
                    <CreativeCard className="p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                <MapPin className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Sitemaps</p>
                                <p className="text-xs text-muted-foreground">Manage & sync sitemaps</p>
                            </div>
                        </div>
                    </CreativeCard>
                </Link>

                <Link href={`/dashboard/sites/${rawDomain}/history`}>
                    <CreativeCard className="p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                <FileText className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">History</p>
                                <p className="text-xs text-muted-foreground">View all submissions</p>
                            </div>
                        </div>
                    </CreativeCard>
                </Link>
            </div>

            {/* Recent Submissions */}
            {recentSubmissions.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold font-handwritten">Recent Submissions</h2>
                        <Link href={`/dashboard/sites/${rawDomain}/history`} className="text-xs text-primary hover:underline">
                            View all →
                        </Link>
                    </div>
                    <CreativeCard className="overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody className="divide-y">
                                {recentSubmissions.map((sub: { id: string; url: string; status: number; submittedAt: Date }) => (
                                    <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs truncate max-w-xs">{sub.url}</td>
                                        <td className="px-4 py-3 w-20">
                                            <span className={`text-xs font-bold ${sub.status >= 200 && sub.status < 300 ? "text-emerald-500" : "text-red-500"}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground w-32">
                                            {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CreativeCard>
                </div>
            )}
        </div>
    );
}
