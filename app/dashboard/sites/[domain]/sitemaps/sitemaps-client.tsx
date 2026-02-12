"use client";

import { useState } from "react";
import { CreativeCard } from "@/components/ui/creative-card";
import { CreativeButton } from "@/components/ui/creative-button";
import { MapPin, Plus, Globe, Loader2, Trash2, RefreshCw, ExternalLink } from "lucide-react";
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
    site, 
    initialSitemaps 
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
        try { new URL(manualUrl); } catch {
            toast.error("Invalid URL");
            return;
        }
        setAdding(true);
        try {
            const { saveSitemaps } = await import("@/app/actions/sitemaps");
            const result = await saveSitemaps(site.id, [manualUrl.trim()]);
            if (result.success) {
                toast.success("Sitemap added");
                setManualUrl("");
                router.refresh();
            }
        } catch (e: unknown) {
            toast.error("Failed to add sitemap", { description: (e as Error).message });
        }
        setAdding(false);
    };

    const handleImportGSC = async () => {
        setImporting(true);
        try {
            const { fetchGSCSitemaps } = await import("@/app/actions/gsc");
            const result = await fetchGSCSitemaps(site.gscSiteUrl);
            
            if (result.needsAuth) {
                toast.error("GSC not connected", {
                    description: "Connect your Google Account first.",
                    action: { label: "Connect", onClick: async () => {
                        const { initiateGoogleOAuth } = await import("@/app/actions/gsc");
                        const url = await initiateGoogleOAuth();
                        window.location.href = url;
                    }}
                });
            } else if (result.sitemaps && result.sitemaps.length > 0) {
                const { saveSitemaps } = await import("@/app/actions/sitemaps");
                const urls = result.sitemaps.map((s: { path: string }) => s.path);
                await saveSitemaps(site.id, urls);
                toast.success(`Imported ${urls.length} sitemaps from GSC`);
                router.refresh();
            } else {
                toast.info("No sitemaps found in GSC for this site");
            }
        } catch (e: unknown) {
            toast.error("Import failed", { description: (e as Error).message });
        }
        setImporting(false);
    };

    const handleSync = async (sitemapUrl: string, id: string) => {
        setSyncingId(id);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: site.gscSiteUrl, sitemapUrl }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Synced! ${result.submitted} URLs indexed`);
                router.refresh();
            } else {
                toast.error("Sync failed", { description: result.error });
            }
        } catch {
            toast.error("Sync failed");
        }
        setSyncingId(null);
    };

    const handleDelete = async (id: string) => {
        try {
            setSitemaps(prev => prev.filter(s => s.id !== id));
            const result = await deleteSitemap(id);
            if (result.success) {
                toast.success("Sitemap removed");
            } else {
                router.refresh();
                toast.error("Delete failed", { description: result.error });
            }
        } catch {
            router.refresh();
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-handwritten tracking-tight">Sitemaps</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage sitemaps for <strong>{site.domain}</strong>
                    </p>
                </div>
                <CreativeButton variant="outline" onClick={handleImportGSC} disabled={importing}>
                    {importing 
                        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                        : <Globe className="w-4 h-4 mr-2" />
                    }
                    Import from GSC
                </CreativeButton>
            </div>

            {/* Add manually */}
            <CreativeCard className="p-4">
                <div className="flex items-center gap-3">
                    <input
                        value={manualUrl}
                        onChange={e => setManualUrl(e.target.value)}
                        placeholder={`https://${site.domain}/sitemap.xml`}
                        className="flex-1 px-3 py-2 text-sm font-mono bg-muted/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        onKeyDown={e => e.key === "Enter" && handleAddManual()}
                    />
                    <CreativeButton variant="primary" onClick={handleAddManual} disabled={adding || !manualUrl.trim()}>
                        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                        Add
                    </CreativeButton>
                </div>
            </CreativeCard>

            {/* Sitemaps list */}
            {sitemaps.length === 0 ? (
                <CreativeCard className="p-12 text-center text-muted-foreground border-dashed">
                    <MapPin className="w-10 h-10 mx-auto mb-4 opacity-30" />
                    <p className="font-handwritten text-lg">No sitemaps yet</p>
                    <p className="text-xs mt-2">Add a sitemap URL or import from Google Search Console.</p>
                </CreativeCard>
            ) : (
                <div className="space-y-2">
                    {sitemaps.map(sm => (
                        <CreativeCard key={sm.id} className="p-4 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-mono truncate">{sm.url}</p>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                                    {sm.urlsCount != null && <span>{sm.urlsCount} URLs</span>}
                                    {sm.lastCrawled && (
                                        <span>Last synced: {new Date(sm.lastCrawled).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={sm.url}
                                    target="_blank"
                                    rel="noopener"
                                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                    title="Open sitemap"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                    onClick={() => handleSync(sm.url, sm.id)}
                                    disabled={syncingId === sm.id}
                                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                    title="Sync & index"
                                >
                                    {syncingId === sm.id 
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
                                        : <RefreshCw className="w-3.5 h-3.5" />
                                    }
                                </button>
                                <button
                                    onClick={() => handleDelete(sm.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
                                    title="Remove"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </CreativeCard>
                    ))}
                </div>
            )}
        </div>
    );
}
