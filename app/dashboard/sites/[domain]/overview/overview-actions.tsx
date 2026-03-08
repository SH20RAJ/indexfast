"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
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

    const handleToggle = async () => {
        try {
            const newState = !autoIndex;
            setAutoIndex(newState);
            await toggleAutoIndex(site.id, newState);
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: unknown) {
            setAutoIndex(!autoIndex);
            const err = e as { message?: string };
            if (err.message?.includes("requires the pro plan")) {
                toast.error("Auto-indexing requires Pro", {
                    action: { label: "Upgrade", onClick: () => router.push("/dashboard/billing") }
                });
            } else {
                toast.error("Failed", { description: err.message });
            }
        }
    };

    return (
        <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight ${autoIndex ? "text-emerald-400" : "text-muted-foreground/30"}`}>
                    {autoIndex ? "Active" : "Disabled"}
                </span>
                <span className="text-[10px] text-muted-foreground/40 font-medium">Auto-sync on sync</span>
            </div>
            <button onClick={handleToggle} className="hover:opacity-80 transition-opacity">
                {autoIndex
                    ? <ToggleRight className="w-8 h-8 text-emerald-400" />
                    : <ToggleLeft className="w-8 h-8 text-muted-foreground/20" />
                }
            </button>
        </div>
    );
}
