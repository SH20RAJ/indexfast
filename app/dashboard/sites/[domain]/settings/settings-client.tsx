"use client";

import { useState } from "react";
import { DashCard } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import {
    ToggleLeft, ToggleRight, Trash2, Shield, AlertCircle, Key,
    Copy, Check, RefreshCw, ExternalLink, CheckCircle2, XCircle, Info
} from "lucide-react";
import { toggleAutoIndex, regenerateIndexNowKey } from "@/app/actions/dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SiteData {
    id: string; domain: string; gscSiteUrl: string; isVerified: boolean;
    autoIndex: boolean; createdAt: string | Date; permissionLevel: string | null;
    indexNowKey: string | null; indexNowKeyVerified: boolean;
}

export default function SiteSettingsClient({ site }: { site: SiteData }) {
    const router = useRouter();
    const [autoIndex, setAutoIndex] = useState(site.autoIndex);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // IndexNow key state
    const [indexNowKey, setIndexNowKey] = useState(site.indexNowKey || "");
    const [keyVerified, setKeyVerified] = useState(site.indexNowKeyVerified);
    const [copied, setCopied] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

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

    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleVerifyKey = async () => {
        setVerifying(true);
        try {
            const res = await fetch("/api/verify-indexnow-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteId: site.id }),
            });
            const data = await res.json();
            if (data.verified) {
                setKeyVerified(true);
                toast.success("IndexNow key verified!", { description: "Your key file was found and matches." });
            } else {
                setKeyVerified(false);
                toast.error("Verification failed", { description: data.error });
            }
        } catch {
            toast.error("Verification failed", { description: "Network error" });
        }
        setVerifying(false);
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const result = await regenerateIndexNowKey(site.id);
            if (result.success && result.key) {
                setIndexNowKey(result.key);
                setKeyVerified(false);
                toast.success("New IndexNow key generated", { description: "Remember to update the key file on your domain." });
            } else {
                toast.error("Failed to regenerate key");
            }
        } catch {
            toast.error("Failed to regenerate key");
        }
        setRegenerating(false);
    };

    const domain = site.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const keyFileUrl = `https://${domain}/${indexNowKey}.txt`;

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

            {/* IndexNow Key Management */}
            <DashCard glow={keyVerified ? "emerald" : "blue"} className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center",
                        keyVerified ? "bg-emerald-500/10" : "bg-blue-500/10"
                    )}>
                        <Key className={cn("w-5 h-5", keyVerified ? "text-emerald-400" : "text-blue-400")} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">IndexNow API Key</h3>
                        <p className="text-xs text-muted-foreground/60">
                            Required for submitting URLs to Bing, Yandex, and other search engines.
                        </p>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold",
                        keyVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    )}>
                        {keyVerified ? "Verified" : "Not Verified"}
                    </div>
                </div>

                {/* Key Display */}
                {indexNowKey && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2.5 bg-muted/20 border border-border/30 rounded-lg font-mono text-sm select-all truncate">
                                {indexNowKey}
                            </div>
                            <button
                                onClick={() => copyToClipboard(indexNowKey, "key")}
                                className="p-2.5 hover:bg-muted/30 rounded-lg border border-border/30 transition-colors shrink-0"
                            >
                                {copied === "key" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                            </button>
                        </div>

                        {/* Key File URL */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                                Key File URL
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 bg-muted/10 border border-border/20 rounded-lg font-mono text-xs text-muted-foreground/70 truncate">
                                    {keyFileUrl}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(keyFileUrl, "url")}
                                    className="p-2 hover:bg-muted/30 rounded-lg border border-border/30 transition-colors shrink-0"
                                >
                                    {copied === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                </button>
                            </div>
                        </div>

                        {/* Key File Content */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                                Key File Content (paste into {indexNowKey}.txt)
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-3 py-2 bg-muted/10 border border-border/20 rounded-lg font-mono text-xs text-muted-foreground/70">
                                    {indexNowKey}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(indexNowKey, "content")}
                                    className="p-2 hover:bg-muted/30 rounded-lg border border-border/30 transition-colors shrink-0"
                                >
                                    {copied === "content" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <DashCard variant="accent" className="p-3">
                    <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-primary">Setup Instructions</p>
                            <ol className="text-[11px] text-muted-foreground/60 space-y-1 list-decimal list-inside">
                                <li>Create a text file named <code className="px-1 py-0.5 rounded bg-muted/30 text-[10px]">{indexNowKey}.txt</code></li>
                                <li>Paste only the key <code className="px-1 py-0.5 rounded bg-muted/30 text-[10px]">{indexNowKey}</code> as the file content</li>
                                <li>Upload it to your domain root: <code className="px-1 py-0.5 rounded bg-muted/30 text-[10px]">https://{domain}/{indexNowKey}.txt</code></li>
                                <li>Click &quot;Verify Key&quot; below to confirm</li>
                            </ol>
                        </div>
                    </div>
                </DashCard>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                    <DashButton
                        onClick={handleVerifyKey}
                        loading={verifying}
                        icon={keyVerified ? <CheckCircle2 className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                        size="sm"
                    >
                        {keyVerified ? "Re-verify" : "Verify Key"}
                    </DashButton>
                    <DashButton
                        variant="ghost"
                        onClick={handleRegenerate}
                        loading={regenerating}
                        icon={<RefreshCw className="w-3.5 h-3.5" />}
                        size="sm"
                    >
                        Regenerate Key
                    </DashButton>
                </div>

                {/* Verification Status */}
                {keyVerified && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-medium">Key file verified and active</span>
                    </div>
                )}
                {!keyVerified && indexNowKey && (
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Key file not verified yet — host the file and click Verify</span>
                    </div>
                )}
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
