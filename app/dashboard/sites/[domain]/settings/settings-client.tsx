"use client";

import { useState } from "react";
import { DashCard } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import { ToggleLeft, ToggleRight, Trash2, Shield, AlertCircle, Key, Loader2 } from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SiteData {
    id: string; domain: string; gscSiteUrl: string; isVerified: boolean;
    autoIndex: boolean; createdAt: string | Date; permissionLevel: string | null;
}

export default function SiteSettingsClient({ site }: { site: SiteData }) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggleAutoIndex = async () => {
        try {
            const newState = !autoIndex; setAutoIndex(newState);
            await toggleAutoIndex(site.id, newState);
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: unknown) {
            setAutoIndex(autoIndex);
            const err = e as { message?: string };
            if (err.message?.includes("requires the pro plan")) toast.error("Pro plan required", { action: { label: "Upgrade", onClick: () => router.push("/dashboard/billing") } });
            else toast.error("Failed", { description: err.message });
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const { deleteSite } = await import("@/app/actions/dashboard");
            const result = await deleteSite(site.id);
            if (result?.success) { toast.success("Site removed"); router.push("/dashboard/sites"); }
            else toast.error("Failed to delete site");
        } catch (e: unknown) { toast.error("Failed", { description: (e as Error).message }); }
        setDeleting(false); setShowDeleteConfirm(false);
    };

    return (
        <div className="space-y-8 max-w-3xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Configuration for <span className="font-medium text-foreground">{site.domain}</span>
                </p>
            </div>

            {/* Verification */}
            <DashCard glow={site.isVerified ? "emerald" : "amber"} className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${site.isVerified ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                        {site.isVerified ? <Shield className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">Verification</h3>
                        <p className="text-xs text-muted-foreground/60">{site.isVerified ? "Verified in Google Search Console." : "Not verified. Some features may be limited."}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${site.isVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {site.isVerified ? "Verified" : "Unverified"}
                    </div>
                </div>
            </DashCard>

            {/* Auto-Indexing */}
            <DashCard className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Key className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Auto-Indexing</h3>
                            <p className="text-xs text-muted-foreground/60">Automatically submit new URLs from sitemaps when syncing.</p>
                        </div>
                    </div>
                    <button onClick={handleToggleAutoIndex} className="hover:opacity-80 transition-opacity">
                        {autoIndex ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground/30" />}
                    </button>
                </div>
            </DashCard>

            {/* Property Details */}
            <DashCard className="p-6 space-y-4">
                <h3 className="text-sm font-semibold">Property Details</h3>
                <div className="space-y-0 text-sm">
                    {[
                        ["Domain", site.domain],
                        ["GSC URL", site.gscSiteUrl],
                        ["Permission", site.permissionLevel || "—"],
                        ["Added", new Date(site.createdAt).toLocaleDateString()],
                    ].map(([label, value], i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-border/20 last:border-0">
                            <span className="text-muted-foreground/60">{label}</span>
                            <span className={label === "GSC URL" ? "font-mono text-xs" : "capitalize"}>{value}</span>
                        </div>
                    ))}
                </div>
            </DashCard>

            {/* Danger Zone */}
            <DashCard variant="danger" className="p-6 space-y-4">
                <h3 className="font-semibold text-sm text-red-400">Danger Zone</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Remove this property</p>
                        <p className="text-xs text-muted-foreground/50">Removes the site and all data permanently.</p>
                    </div>
                    {!showDeleteConfirm ? (
                        <DashButton variant="danger" onClick={() => setShowDeleteConfirm(true)} icon={<Trash2 className="w-3.5 h-3.5" />} size="sm">
                            Remove
                        </DashButton>
                    ) : (
                        <div className="flex items-center gap-2">
                            <DashButton variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</DashButton>
                            <DashButton variant="danger" size="sm" onClick={handleDelete} loading={deleting}>Confirm Delete</DashButton>
                        </div>
                    )}
                </div>
            </DashCard>
        </div>
    );
}
