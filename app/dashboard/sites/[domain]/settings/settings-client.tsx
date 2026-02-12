"use client";

import { useState } from "react";
import { CreativeCard } from "@/components/ui/creative-card";
import { CreativeButton } from "@/components/ui/creative-button";
import { ToggleLeft, ToggleRight, Trash2, Check, AlertCircle, Shield, Key, Loader2 } from "lucide-react";
import { toggleAutoIndex } from "@/app/actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SiteData {
    id: string;
    domain: string;
    gscSiteUrl: string;
    isVerified: boolean;
    autoIndex: boolean;
    createdAt: string | Date;
    permissionLevel: string | null;
}

export default function SiteSettingsClient({ site }: { site: SiteData }) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggleAutoIndex = async () => {
        try {
            const newState = !autoIndex;
            setAutoIndex(newState);
            await toggleAutoIndex(site.id, newState);
            toast.success(newState ? "Auto-indexing enabled" : "Auto-indexing disabled");
        } catch (e: unknown) {
            setAutoIndex(autoIndex);
            const err = e as { message?: string };
            if (err.message?.includes("requires the pro plan")) {
                toast.error("Pro plan required", {
                    action: { label: "Upgrade", onClick: () => router.push("/dashboard/billing") }
                });
            } else {
                toast.error("Failed", { description: err.message });
            }
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const { deleteSite } = await import("@/app/actions/dashboard");
            const result = await deleteSite(site.id);
            if (result?.success) {
                toast.success("Site removed");
                router.push("/dashboard/sites");
            } else {
                toast.error("Failed to delete site");
            }
        } catch (e: unknown) {
            toast.error("Failed", { description: (e as Error).message });
        }
        setDeleting(false);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold font-handwritten tracking-tight">Site Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Configuration for <strong>{site.domain}</strong>
                </p>
            </div>

            {/* Verification Status */}
            <CreativeCard className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        site.isVerified ? "bg-emerald-500/10" : "bg-amber-500/10"
                    }`}>
                        {site.isVerified 
                            ? <Shield className="w-5 h-5 text-emerald-500" /> 
                            : <AlertCircle className="w-5 h-5 text-amber-500" />
                        }
                    </div>
                    <div>
                        <h3 className="font-semibold">Verification</h3>
                        <p className="text-sm text-muted-foreground">
                            {site.isVerified ? "This site is verified in Google Search Console." : "Not verified. Some features may be limited."}
                        </p>
                    </div>
                    <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border ${
                        site.isVerified 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                        {site.isVerified ? "Verified" : "Unverified"}
                    </div>
                </div>
            </CreativeCard>

            {/* Auto-Indexing */}
            <CreativeCard className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Key className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Auto-Indexing</h3>
                            <p className="text-sm text-muted-foreground">
                                Automatically submit new URLs from sitemaps when syncing.
                            </p>
                        </div>
                    </div>
                    <button onClick={handleToggleAutoIndex} className="hover:opacity-80 transition-opacity">
                        {autoIndex
                            ? <ToggleRight className="w-8 h-8 text-emerald-500" />
                            : <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                        }
                    </button>
                </div>
            </CreativeCard>

            {/* Site Info */}
            <CreativeCard className="p-6 space-y-4">
                <h3 className="font-semibold">Property Details</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground">Domain</span>
                        <span className="font-mono">{site.domain}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground">GSC URL</span>
                        <span className="font-mono text-xs">{site.gscSiteUrl}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground">Permission Level</span>
                        <span className="capitalize">{site.permissionLevel || "—"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Added</span>
                        <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </CreativeCard>

            {/* Danger Zone */}
            <CreativeCard className="p-6 border-red-500/20 space-y-4">
                <h3 className="font-semibold text-red-500">Danger Zone</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Remove this property</p>
                        <p className="text-xs text-muted-foreground">This will remove the site and all its data from IndexFast. This cannot be undone.</p>
                    </div>
                    {!showDeleteConfirm ? (
                        <CreativeButton 
                            variant="outline" 
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10" 
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                        </CreativeButton>
                    ) : (
                        <div className="flex items-center gap-2">
                            <CreativeButton variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</CreativeButton>
                            <CreativeButton 
                                variant="primary"
                                className="bg-red-500 hover:bg-red-600"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Confirm Delete
                            </CreativeButton>
                        </div>
                    )}
                </div>
            </CreativeCard>
        </div>
    );
}
