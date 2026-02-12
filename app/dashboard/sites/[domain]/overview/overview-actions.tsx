"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight, Loader2, RefreshCw } from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
import { CreativeButton } from "@/components/ui/creative-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SiteData {
    id: string;
    domain: string;
    gscSiteUrl: string;
    autoIndex: boolean;
}

export function OverviewActions({ site }: { site: SiteData }) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [syncing, setSyncing] = useState(false);

    const handleToggle = async () => {
        try {
            const newState = !autoIndex;
            setAutoIndex(newState);
            await toggleAutoIndex(site.id, newState);
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: unknown) {
            setAutoIndex(!autoIndex);
            const err = e as { message?: string; digest?: string };
            if (err.message?.includes("requires the pro plan")) {
                toast.error("Auto-indexing requires Pro", {
                    description: "Upgrade to enable auto-indexing.",
                    action: { label: "Upgrade", onClick: () => router.push("/dashboard/billing") }
                });
            } else {
                toast.error("Failed", { description: err.message });
            }
        }
    };

    const handleQuickSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: site.gscSiteUrl }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Indexed ${result.submitted} URLs`, {
                    description: `Credits remaining: ${result.credits_remaining}`
                });
                router.refresh();
            } else {
                toast.error("Sync failed", { description: result.error });
            }
        } catch {
            toast.error("Sync failed");
        }
        setSyncing(false);
    };

    return (
        <div className="flex items-center justify-between">
            <span className={`font-bold text-lg ${autoIndex ? "text-emerald-500" : "text-muted-foreground"}`}>
                {autoIndex ? "On" : "Off"}
            </span>
            <button onClick={handleToggle} className="hover:opacity-80 transition-opacity">
                {autoIndex
                    ? <ToggleRight className="w-7 h-7 text-emerald-500" />
                    : <ToggleLeft className="w-7 h-7 text-muted-foreground" />
                }
            </button>
        </div>
    );
}
