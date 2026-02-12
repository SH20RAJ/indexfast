"use client";

import { useState } from "react";
import { DashCard } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import { MapPin, Plus, Globe, Trash2, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteSitemap } from "@/app/actions/sitemaps";

interface Sitemap {
    id: string;
    url: string;
    urlsCount: number | null;
    isEnabled: boolean;
    lastCrawled: string | null;
    createdAt: string;
}

export default function SitemapsClient({ 
    site, initialSitemaps 
}: { 
    site: { id: string; domain: string; gscSiteUrl: string };
    initialSitemaps: Sitemap[];
}) {
    const router = useRouter();
    const [sitemaps, setSitemaps] = useState<Sitemap[]>(initialSitemaps);
    const [manualUrl, setManualUrl] = useState("");
    const [adding, setAdding] = useState(false);
    const [importing, setImporting] = useState(false);
    const [syncingId, setSyncingId] = useState<string | null>(null);

    const handleAddManual = async () => {
        if (!manualUrl.trim()) return;
        try { new URL(manualUrl); } catch { toast.error("Invalid URL"); return; }
        setAdding(true);
        try {
            const { saveSitemaps } = await import("@/app/actions/sitemaps");
            const result = await saveSitemaps(site.id, [manualUrl.trim()]);
            if (result.success) { toast.success("Sitemap added"); setManualUrl(""); router.refresh(); }
        } catch (e: unknown) { toast.error("Failed", { description: (e as Error).message }); }
        setAdding(false);
    };

    const handleImportGSC = async () => {
        setImporting(true);
        try {
            const { fetchGSCSitemaps } = await import("@/app/actions/gsc");
            const result = await fetchGSCSitemaps(site.gscSiteUrl);
            if (result.needsAuth) {
                toast.error("GSC not connected", {
                    action: { label: "Connect", onClick: async () => {
                        const { initiateGoogleOAuth } = await import("@/app/actions/gsc");
                        window.location.href = await initiateGoogleOAuth();
                    }}
                });
            } else if (result.sitemaps?.length > 0) {
                const { saveSitemaps } = await import("@/app/actions/sitemaps");
                await saveSitemaps(site.id, result.sitemaps.map((s: { path: string }) => s.path));
                toast.success(`Imported ${result.sitemaps.length} sitemaps`);
                router.refresh();
            } else { toast.info("No sitemaps found in GSC"); }
        } catch (e: unknown) { toast.error("Import failed", { description: (e as Error).message }); }
        setImporting(false);
    };

    const handleSync = async (sitemapUrl: string, id: string) => {
        setSyncingId(id);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: site.gscSiteUrl, sitemapUrl }),
            });
            const result = await res.json();
            if (result.success) { toast.success(`Synced! ${result.submitted} URLs indexed`); router.refresh(); }
            else toast.error("Sync failed", { description: result.error });
        } catch { toast.error("Sync failed"); }
        setSyncingId(null);
    };

    const handleDelete = async (id: string) => {
        setSitemaps(prev => prev.filter(s => s.id !== id));
        try {
            const result = await deleteSitemap(id);
            if (result.success) toast.success("Sitemap removed");
            else { router.refresh(); toast.error("Delete failed"); }
        } catch { router.refresh(); toast.error("Delete failed"); }
    };

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sitemaps</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage sitemaps for <span className="font-medium text-foreground">{site.domain}</span>
                    </p>
                </div>
                <DashButton variant="outline" onClick={handleImportGSC} loading={importing} icon={<Globe className="w-4 h-4" />}>
                    Import from GSC
                </DashButton>
            </div>

            {/* Add manually */}
            <DashCard className="p-4">
                <div className="flex items-center gap-3">
                    <input
                        value={manualUrl}
                        onChange={e => setManualUrl(e.target.value)}
                        placeholder={`https://${site.domain}/sitemap.xml`}
                        className="flex-1 px-3 py-2 text-sm font-mono bg-muted/20 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        onKeyDown={e => e.key === "Enter" && handleAddManual()}
                    />
                    <DashButton onClick={handleAddManual} loading={adding} disabled={!manualUrl.trim()} icon={<Plus className="w-4 h-4" />}>
                        Add
                    </DashButton>
                </div>
            </DashCard>

            {/* List */}
            {sitemaps.length === 0 ? (
                <DashCard variant="ghost" className="p-16 text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-4 text-muted-foreground/20" />
                    <p className="text-base font-semibold text-muted-foreground/50">No sitemaps yet</p>
                    <p className="text-xs text-muted-foreground/30 mt-1.5">Add a sitemap URL or import from Google Search Console.</p>
                </DashCard>
            ) : (
                <div className="space-y-2">
                    {sitemaps.map(sm => (
                        <DashCard key={sm.id} hoverable className="p-4 flex items-center gap-4 group">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-mono truncate text-foreground/80">{sm.url}</p>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50 mt-0.5">
                                    {sm.urlsCount != null && <span>{sm.urlsCount} URLs</span>}
                                    {sm.lastCrawled && <span>Last synced: {new Date(sm.lastCrawled).toLocaleDateString()}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={sm.url} target="_blank" rel="noopener"
                                    className="p-2 hover:bg-muted/50 rounded-md text-muted-foreground/50 hover:text-foreground transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button onClick={() => handleSync(sm.url, sm.id)} disabled={syncingId === sm.id}
                                    className="p-2 hover:bg-muted/50 rounded-md text-muted-foreground/50 hover:text-foreground transition-colors">
                                    {syncingId === sm.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => handleDelete(sm.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground/50 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </DashCard>
                    ))}
                </div>
            )}
        </div>
    );
}
