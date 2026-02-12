"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { CreativeCard } from "@/components/ui/creative-card";
import { Loader2, RefreshCw, ToggleLeft, ToggleRight, Trash2, ExternalLink, Check, AlertCircle } from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SiteDetailsClient({ site, stats }: { site: any, stats: any }) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [actioning, setActioning] = useState<string | null>(null);

    const handleSync = async () => {
        setActioning('sync');
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                body: JSON.stringify({ siteUrl: site.gscSiteUrl }),
            });
            const result = await res.json() as any;
            if (result.success) {
                toast.success(`Synced! Processed: ${result.processed}, Submitted: ${result.submitted}`);
                router.refresh();
            } else {
                toast.error("Sync failed", { description: result.message || result.error || "Unknown error" });
            }
        } catch (e) {
            console.error(e);
            toast.error("Sync failed");
        }
        setActioning(null);
    };

    const handleToggleAutoIndex = async () => {
        try {
            const newState = !autoIndex;
            setAutoIndex(newState); // Optimistic update
            await toggleAutoIndex(site.id, newState);
            router.refresh();
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: any) {
            console.error(e);
            setAutoIndex(!autoIndex); // Revert
            
             if (e.message?.includes("requires the pro plan") || e.digest?.includes("requires the pro plan")) {
                toast.error("Auto-indexing requires Pro", {
                    description: "Unlock auto-indexing with the Pro plan.",
                    action: {
                        label: "Upgrade",
                        onClick: () => router.push("/dashboard/billing")
                    }
                });
            } else {
                toast.error("Failed to toggle auto-index", { description: e.message });
            }
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <CreativeCard className="p-6 space-y-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                        site.isVerified 
                        ? "bg-green-500/10 text-green-600 border-green-500/20" 
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                        {site.isVerified ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        {site.isVerified ? "Verified" : "Unverified"}
                    </div>
                </div>
            </CreativeCard>

            <CreativeCard className="p-6 space-y-2">
                <span className="text-sm text-muted-foreground">Auto-Index</span>
                <div className="flex items-center justify-between">
                    <span className={`font-bold ${autoIndex ? "text-brand" : "text-muted-foreground"}`}>
                        {autoIndex ? "Enabled" : "Disabled"}
                    </span>
                    <button onClick={handleToggleAutoIndex} className="text-brand hover:text-brand/80 transition-colors">
                        {autoIndex ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                    </button>
                </div>
            </CreativeCard>

             <CreativeCard className="p-6 space-y-2">
                <span className="text-sm text-muted-foreground">Monthly Submissions</span>
                <div className="text-2xl font-bold font-handwritten">
                    {stats.totalSubmissions}
                </div>
            </CreativeCard>

            <CreativeCard className="p-6 flex flex-col justify-center space-y-3">
                <CreativeButton 
                    onClick={handleSync} 
                    disabled={!!actioning}
                    className="w-full"
                    variant="primary"
                >
                    {actioning === 'sync' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Sync Now
                </CreativeButton>
                 <a href={`https://${site.domain}`} target="_blank" rel="noreferrer" className="w-full">
                    <CreativeButton variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                    </CreativeButton>
                </a>
            </CreativeCard>
        </div>
    );
}
