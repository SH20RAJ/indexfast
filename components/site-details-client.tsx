"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { CreativeCard } from "@/components/ui/creative-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Loader2, RefreshCw, ToggleLeft, ToggleRight, ExternalLink, 
    Check, AlertCircle, Send, FileText, Link2, Plus, Trash2, 
    Globe, MapPin 
} from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
import { saveSitemaps, deleteSitemap } from "@/app/actions/sitemaps";
import { fetchGSCSitemaps } from "@/app/actions/gsc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Sitemap {
    id: string;
    siteId: string;
    url: string;
    lastCrawled: string | null;
    urlsCount: number;
    isEnabled: boolean;
    createdAt: string;
}

interface Submission {
    id: string;
    url: string;
    status: number;
    submittedAt: string;
}

interface SiteData {
    id: string;
    domain: string;
    gscSiteUrl: string;
    isVerified: boolean;
    autoIndex: boolean;
    createdAt: string | Date;
}

export default function SiteDetailsClient({ 
    site, 
    stats, 
    initialSitemaps,
    submissions 
}: { 
    site: SiteData;
    stats: { totalSubmissions: number };
    initialSitemaps: Sitemap[];
    submissions: Submission[];
}) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [actioning, setActioning] = useState<string | null>(null);
    const [sitemapsList, setSitemapsList] = useState<Sitemap[]>(initialSitemaps);
    const [manualUrls, setManualUrls] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fetchingSitemaps, setFetchingSitemaps] = useState(false);

    // ---- Sync via Default Sitemap ----
    const handleSync = async (sitemapUrl?: string) => {
        setActioning(sitemapUrl || 'sync');
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    siteUrl: site.gscSiteUrl,
                    ...(sitemapUrl ? { sitemapUrl } : {})
                }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Indexed ${result.submitted} URLs`, { 
                    description: `Processed: ${result.processed} • Credits remaining: ${result.credits_remaining}` 
                });
                router.refresh();
            } else {
                toast.error("Sync failed", { description: result.error || "Unknown error" });
            }
        } catch (e) {
            console.error(e);
            toast.error("Sync failed");
        }
        setActioning(null);
    };

    // ---- Manual URL Submission ----
    const handleManualSubmit = async () => {
        const urls = manualUrls
            .split("\n")
            .map(u => u.trim())
            .filter(u => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));

        if (urls.length === 0) {
            toast.error("No valid URLs", { description: "Enter URLs starting with http:// or https://, one per line." });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    siteUrl: site.gscSiteUrl,
                    manualUrls: urls 
                }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Submitted ${result.submitted} URLs to IndexNow`, {
                    description: `Credits remaining: ${result.credits_remaining}`
                });
                setManualUrls("");
                router.refresh();
            } else {
                toast.error("Submission failed", { description: result.error || "Unknown error" });
            }
        } catch (e) {
            console.error(e);
            toast.error("Submission failed");
        }
        setSubmitting(false);
    };

    // ---- Fetch Sitemaps from GSC ----
    const handleFetchGSCSitemaps = async () => {
        setFetchingSitemaps(true);
        try {
            const result = await fetchGSCSitemaps(site.gscSiteUrl);
            if ('error' in result && result.error) {
                if (result.error === 'not_connected' || result.error === 'token_expired') {
                    toast.error("Google account not connected", {
                        description: "Connect your Google account from the Sites page to fetch sitemaps.",
                    });
                } else {
                    toast.error("Failed to fetch sitemaps", { description: result.error });
                }
                setFetchingSitemaps(false);
                return;
            }

            const gscSitemaps = ('sitemaps' in result && result.sitemaps) ? result.sitemaps : [];
            
            if (gscSitemaps.length === 0) {
                toast.info("No sitemaps found in Google Search Console for this property.");
                setFetchingSitemaps(false);
                return;
            }

            // Save to DB
            const urls = gscSitemaps.map((s: { path: string }) => s.path);
            const saveResult = await saveSitemaps(site.id, urls);
            
            if (saveResult.success) {
                toast.success(`Imported ${saveResult.count} sitemaps from GSC`);
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch sitemaps from GSC");
        }
        setFetchingSitemaps(false);
    };

    // ---- Delete Sitemap ----
    const handleDeleteSitemap = async (sitemapId: string) => {
        try {
            const result = await deleteSitemap(sitemapId);
            if (result.success) {
                setSitemapsList(prev => prev.filter(s => s.id !== sitemapId));
                toast.success("Sitemap removed");
            } else {
                toast.error("Failed to remove sitemap");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to remove sitemap");
        }
    };

    // ---- Toggle Auto-Index ----
    const handleToggleAutoIndex = async () => {
        try {
            const newState = !autoIndex;
            setAutoIndex(newState);
            await toggleAutoIndex(site.id, newState);
            router.refresh();
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: unknown) {
            console.error(e);
            setAutoIndex(!autoIndex);
            const err = e as { message?: string; digest?: string };
            if (err.message?.includes("requires the pro plan") || err.digest?.includes("requires the pro plan")) {
                toast.error("Auto-indexing requires Pro", {
                    description: "Unlock auto-indexing with the Pro plan.",
                    action: { label: "Upgrade", onClick: () => router.push("/dashboard/billing") }
                });
            } else {
                toast.error("Failed to toggle auto-index", { description: err.message });
            }
        }
    };

    const urlCount = manualUrls.split("\n").filter(u => u.trim().length > 0).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CreativeCard className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            site.isVerified 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                            {site.isVerified ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            {site.isVerified ? "Verified" : "Unverified"}
                        </div>
                    </div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Auto-Index</span>
                    <div className="flex items-center justify-between">
                        <span className={`font-bold ${autoIndex ? "text-emerald-500" : "text-muted-foreground"}`}>
                            {autoIndex ? "Enabled" : "Disabled"}
                        </span>
                        <button onClick={handleToggleAutoIndex} className="hover:opacity-80 transition-opacity">
                            {autoIndex 
                                ? <ToggleRight className="w-8 h-8 text-emerald-500" /> 
                                : <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                            }
                        </button>
                    </div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Monthly Submissions</span>
                    <div className="text-3xl font-bold font-handwritten">{stats.totalSubmissions}</div>
                </CreativeCard>

                <CreativeCard className="p-5 space-y-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Sitemaps</span>
                    <div className="text-3xl font-bold font-handwritten">{sitemapsList.length}</div>
                </CreativeCard>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                <CreativeButton onClick={() => handleSync()} disabled={!!actioning} variant="primary">
                    {actioning === 'sync' 
                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                        : <RefreshCw className="w-4 h-4 mr-2" />
                    }
                    Quick Sync
                </CreativeButton>
                <a href={`https://${site.domain}`} target="_blank" rel="noreferrer">
                    <CreativeButton variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                    </CreativeButton>
                </a>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="sitemaps" className="w-full">
                <TabsList className="w-full md:w-auto bg-muted/50 border border-border/50">
                    <TabsTrigger value="sitemaps" className="gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Sitemaps
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="gap-2">
                        <Link2 className="w-3.5 h-3.5" /> Submit URLs
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <FileText className="w-3.5 h-3.5" /> History
                    </TabsTrigger>
                </TabsList>

                {/* ===== SITEMAPS TAB ===== */}
                <TabsContent value="sitemaps" className="mt-4">
                    <CreativeCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold font-handwritten">Sitemaps</h3>
                                <p className="text-sm text-muted-foreground">Import from Google Search Console or sync individual sitemaps</p>
                            </div>
                            <CreativeButton 
                                onClick={handleFetchGSCSitemaps} 
                                disabled={fetchingSitemaps}
                                variant="outline"
                                className="shrink-0"
                            >
                                {fetchingSitemaps 
                                    ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                                    : <Globe className="w-4 h-4 mr-2" />
                                }
                                Import from GSC
                            </CreativeButton>
                        </div>

                        {sitemapsList.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No sitemaps yet</p>
                                <p className="text-sm mt-1">Click &quot;Import from GSC&quot; to fetch your sitemaps from Google Search Console</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sitemapsList.map(sm => (
                                    <div key={sm.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-mono text-sm truncate" title={sm.url}>{sm.url}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Added {formatDistanceToNow(new Date(sm.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <CreativeButton 
                                                onClick={() => handleSync(sm.url)}
                                                disabled={actioning === sm.url}
                                                variant="outline"
                                                className="h-8 px-3 text-xs"
                                            >
                                                {actioning === sm.url 
                                                    ? <Loader2 className="w-3 h-3 animate-spin" /> 
                                                    : <Send className="w-3 h-3 mr-1" />
                                                }
                                                Sync
                                            </CreativeButton>
                                            <button 
                                                onClick={() => handleDeleteSitemap(sm.id)}
                                                className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CreativeCard>
                </TabsContent>

                {/* ===== MANUAL URLS TAB ===== */}
                <TabsContent value="manual" className="mt-4">
                    <CreativeCard className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold font-handwritten">Submit URLs to IndexNow</h3>
                            <p className="text-sm text-muted-foreground">Enter URLs manually, one per line. Each URL uses one credit.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <textarea
                                    value={manualUrls}
                                    onChange={(e) => setManualUrls(e.target.value)}
                                    placeholder={`https://${site.domain}/blog/new-post\nhttps://${site.domain}/products/new-item\nhttps://${site.domain}/about`}
                                    className="w-full min-h-[200px] p-4 rounded-lg border border-border/50 bg-background font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40"
                                    spellCheck={false}
                                />
                                {urlCount > 0 && (
                                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground font-medium">
                                        {urlCount} URL{urlCount !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    💡 Each URL must start with <code className="px-1 py-0.5 rounded bg-muted font-mono">https://</code>
                                </p>
                                <CreativeButton 
                                    onClick={handleManualSubmit}
                                    disabled={submitting || urlCount === 0}
                                    variant="primary"
                                >
                                    {submitting 
                                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                                        : <Send className="w-4 h-4 mr-2" />
                                    }
                                    Submit {urlCount > 0 ? `${urlCount} URL${urlCount !== 1 ? 's' : ''}` : 'URLs'}
                                </CreativeButton>
                            </div>
                        </div>
                    </CreativeCard>
                </TabsContent>

                {/* ===== HISTORY TAB ===== */}
                <TabsContent value="history" className="mt-4">
                    <CreativeCard className="overflow-hidden">
                        <div className="p-6 pb-0">
                            <h3 className="text-lg font-bold font-handwritten">Submission History</h3>
                            <p className="text-sm text-muted-foreground mb-4">Recent IndexNow submissions for this site</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-muted-foreground bg-muted/30 border-y">
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
                                                <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                No submissions yet. Use the Sitemaps or Submit URLs tab to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs truncate max-w-md" title={sub.url}>
                                                    {sub.url}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                                        sub.status >= 200 && sub.status < 300 
                                                            ? "bg-emerald-500/10 text-emerald-500" 
                                                            : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                        {sub.status >= 200 && sub.status < 300 ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
