"use client";

import { useState } from "react";
import { CreativeCard } from "@/components/ui/creative-card";
import { CreativeButton } from "@/components/ui/creative-button";
import { Key, Plus, Trash2, Copy, Check, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { createApiKey, revokeApiKey } from "@/app/actions/api-keys";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ApiKeyInfo {
    id: string;
    name: string;
    keyPrefix: string;
    keyLast4: string;
    isTest: boolean;
    lastUsedAt: string | null;
    createdAt: string;
}

export default function ApiKeysClient({ initialKeys }: { initialKeys: ApiKeyInfo[] }) {
    const [keys, setKeys] = useState<ApiKeyInfo[]>(initialKeys);
    const [showCreate, setShowCreate] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [isTest, setIsTest] = useState(false);
    const [creating, setCreating] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        if (!newKeyName.trim()) {
            toast.error("Give your key a name");
            return;
        }
        setCreating(true);
        try {
            const result = await createApiKey(newKeyName.trim(), isTest);
            setRevealedKey(result.key);
            setKeys(prev => [{
                id: crypto.randomUUID(),
                name: result.name,
                keyPrefix: result.prefix,
                keyLast4: result.last4,
                isTest: result.isTest,
                lastUsedAt: null,
                createdAt: new Date().toISOString(),
            }, ...prev]);
            setNewKeyName("");
            setShowCreate(false);
            toast.success("API key created");
        } catch (e: unknown) {
            toast.error("Failed", { description: (e as Error).message });
        }
        setCreating(false);
    };

    const handleRevoke = async (id: string, name: string) => {
        setKeys(prev => prev.filter(k => k.id !== id));
        try {
            await revokeApiKey(id);
            toast.success(`Key "${name}" revoked`);
        } catch {
            toast.error("Failed to revoke key");
        }
    };

    const handleCopy = () => {
        if (revealedKey) {
            navigator.clipboard.writeText(revealedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Copied to clipboard");
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-handwritten tracking-tight">API Keys</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage API keys for programmatic access to IndexFast.
                    </p>
                </div>
                <CreativeButton variant="primary" onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Key
                </CreativeButton>
            </div>

            {/* Key revealed banner */}
            {revealedKey && (
                <CreativeCard className="p-5 border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-bold">Save your API key now — you won&apos;t see it again</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 text-sm font-mono bg-background rounded-lg border select-all break-all">
                            {revealedKey}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-muted rounded-md transition-colors shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <button
                        onClick={() => setRevealedKey(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        I&apos;ve saved it — dismiss
                    </button>
                </CreativeCard>
            )}

            {/* Create form */}
            {showCreate && !revealedKey && (
                <CreativeCard className="p-5 space-y-4">
                    <h3 className="font-semibold">Create API Key</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Name</label>
                            <input
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                                placeholder="e.g. CI/CD Pipeline, My Script"
                                className="w-full px-3 py-2 text-sm border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                onKeyDown={e => e.key === "Enter" && handleCreate()}
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTest}
                                    onChange={e => setIsTest(e.target.checked)}
                                    className="rounded"
                                />
                                <span>Test mode</span>
                                <span className="text-xs text-muted-foreground">(no real submissions, no credits used)</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <CreativeButton variant="outline" onClick={() => setShowCreate(false)}>Cancel</CreativeButton>
                        <CreativeButton variant="primary" onClick={handleCreate} disabled={creating || !newKeyName.trim()}>
                            {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                            Generate Key
                        </CreativeButton>
                    </div>
                </CreativeCard>
            )}

            {/* Keys list */}
            {keys.length === 0 ? (
                <CreativeCard className="p-12 text-center text-muted-foreground border-dashed">
                    <Key className="w-10 h-10 mx-auto mb-4 opacity-30" />
                    <p className="font-handwritten text-lg">No API keys yet</p>
                    <p className="text-xs mt-2">Create your first API key to start using the IndexFast API.</p>
                </CreativeCard>
            ) : (
                <div className="space-y-2">
                    {keys.map(key => (
                        <CreativeCard key={key.id} className="p-4 flex items-center gap-4 group hover:border-primary/20 transition-colors">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                key.isTest ? "bg-amber-500/10" : "bg-emerald-500/10"
                            }`}>
                                <Key className={`w-4 h-4 ${key.isTest ? "text-amber-500" : "text-emerald-500"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold">{key.name}</p>
                                    {key.isTest && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                            TEST
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                                    <span className="font-mono">{key.keyPrefix}...{key.keyLast4}</span>
                                    <span>•</span>
                                    <span>Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}</span>
                                    {key.lastUsedAt && (
                                        <>
                                            <span>•</span>
                                            <span>Used {formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleRevoke(key.id, key.name)}
                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-all"
                                title="Revoke key"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </CreativeCard>
                    ))}
                </div>
            )}

            {/* Usage hint */}
            <CreativeCard className="p-5 space-y-3 bg-muted/20">
                <h3 className="text-sm font-semibold">Quick Start</h3>
                <pre className="text-xs font-mono bg-background p-4 rounded-lg border overflow-x-auto">
{`curl -X POST https://indexfast.dev/api/v1/urls/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "site_id": "your-site-id",
    "urls": ["https://example.com/page-1"]
  }'`}
                </pre>
                <p className="text-xs text-muted-foreground">
                    Replace <code className="px-1 py-0.5 rounded bg-muted">YOUR_API_KEY</code> with your key.
                    API access requires a Pro or Agency plan.
                </p>
            </CreativeCard>
        </div>
    );
}
