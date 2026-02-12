import { notFound } from "next/navigation";
import { getSiteDetails } from "@/app/actions/dashboard";
import { getSitemaps } from "@/app/actions/sitemaps";
import { DashCard, DashStat } from "@/components/dashboard/dash-card";
import { formatDistanceToNow } from "date-fns";
import { Check, AlertCircle, Send, MapPin, FileText, Zap, CheckCircle, XCircle } from "lucide-react";
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
    const successCount = recentSubmissions.filter((s: { status: number }) => s.status >= 200 && s.status < 300).length;

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{site.domain}</h1>
                <p className="text-sm text-muted-foreground">
                    <code className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">{site.gscSiteUrl}</code>
                    <span className="mx-2 text-border">•</span>
                    Added {formatDistanceToNow(new Date(site.createdAt), { addSuffix: true })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashCard variant="stat" glow={site.isVerified ? "emerald" : "amber"} className="p-5">
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                            Status
                        </p>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            site.isVerified
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                        }`}>
                            {site.isVerified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {site.isVerified ? "Verified" : "Unverified"}
                        </div>
                    </div>
                </DashCard>

                <DashStat 
                    label="Monthly Submissions" 
                    value={stats.totalSubmissions} 
                    accent="text-blue-400"
                    glow="blue"
                    icon={<Zap className="w-4 h-4 text-blue-400" />}
                />

                <DashStat 
                    label="Sitemaps" 
                    value={sitemapsList.length}
                    accent="text-purple-400"
                    glow="purple"
                    icon={<MapPin className="w-4 h-4 text-purple-400" />}
                />

                <DashCard variant="stat" className="p-5">
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                            Auto-Index
                        </p>
                        <OverviewActions site={JSON.parse(JSON.stringify(site))} />
                    </div>
                </DashCard>
            </div>

            {/* Quick Links */}
            <div className="grid gap-3 sm:grid-cols-3">
                {[
                    { 
                        href: `/dashboard/sites/${rawDomain}/submit`, 
                        icon: Send, color: "text-blue-400", bg: "bg-blue-500/10 group-hover:bg-blue-500/15",
                        title: "Submit URLs", desc: "Submit pages to IndexNow"
                    },
                    { 
                        href: `/dashboard/sites/${rawDomain}/sitemaps`, 
                        icon: MapPin, color: "text-purple-400", bg: "bg-purple-500/10 group-hover:bg-purple-500/15",
                        title: "Sitemaps", desc: "Manage & sync sitemaps"
                    },
                    { 
                        href: `/dashboard/sites/${rawDomain}/history`, 
                        icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10 group-hover:bg-amber-500/15",
                        title: "History", desc: "View all submissions"
                    },
                ].map(item => (
                    <Link key={item.href} href={item.href}>
                        <DashCard hoverable className="p-5 group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center transition-colors`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{item.title}</p>
                                    <p className="text-xs text-muted-foreground/70">{item.desc}</p>
                                </div>
                            </div>
                        </DashCard>
                    </Link>
                ))}
            </div>

            {/* Recent Submissions */}
            {recentSubmissions.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">Recent Submissions</h2>
                        <Link href={`/dashboard/sites/${rawDomain}/history`} className="text-xs text-primary hover:text-primary/80 transition-colors">
                            View all →
                        </Link>
                    </div>
                    <DashCard className="overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-border/30">
                                {recentSubmissions.map((sub: { id: string; url: string; status: number; submittedAt: Date }) => (
                                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                {sub.status >= 200 && sub.status < 300 
                                                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 
                                                    : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                                }
                                                <span className="font-mono text-xs truncate max-w-sm text-muted-foreground">{sub.url}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 w-20">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                                sub.status >= 200 && sub.status < 300
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-muted-foreground/60 w-36 text-right">
                                            {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DashCard>
                </div>
            )}
        </div>
    );
}
