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
        <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold tracking-tight ${autoIndex ? "text-emerald-400" : "text-muted-foreground/50"}`}>
                {autoIndex ? "On" : "Off"}
            </span>
            <button onClick={handleToggle} className="hover:opacity-80 transition-opacity">
                {autoIndex
                    ? <ToggleRight className="w-7 h-7 text-emerald-400" />
                    : <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />
                }
            </button>
        </div>
    );
}
