"use client";

import { useState } from "react";
import { DashCard } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import { Key, Plus, Trash2, Copy, Check, AlertTriangle, Code2, Globe, ShieldCheck } from "lucide-react";
import { createApiKey, revokeApiKey } from "@/app/actions/api-keys";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ApiKeyInfo {
    id: string; name: string; keyPrefix: string; keyLast4: string;
    isTest: boolean; lastUsedAt: string | null; createdAt: string;
}

interface SiteInfo {
    id: string;
    domain: string;
}

export default function ApiKeysClient({ initialKeys, sites }: { initialKeys: ApiKeyInfo[]; sites: SiteInfo[] }) {
    const [keys, setKeys] = useState<ApiKeyInfo[]>(initialKeys);
    const [showCreate, setShowCreate] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [isTest, setIsTest] = useState(false);
    const [creating, setCreating] = useState(false);
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        if (!newKeyName.trim()) { toast.error("Give your key a name"); return; }
        setCreating(true);
        try {
            const result = await createApiKey(newKeyName.trim(), isTest);
            setRevealedKey(result.key);
            setKeys(prev => [{ 
                id: result.id, 
                name: result.name, 
                keyPrefix: result.prefix, 
                keyLast4: result.last4, 
                isTest: result.isTest, 
                lastUsedAt: null, 
                createdAt: result.createdAt.toString() 
            }, ...prev]);
            setNewKeyName(""); setShowCreate(false);
            toast.success("API key created");
        } catch (e: unknown) { toast.error("Failed", { description: (e as Error).message }); }
        setCreating(false);
    };

    const handleRevoke = async (id: string, name: string) => {
        setKeys(prev => prev.filter(k => k.id !== id));
        try { await revokeApiKey(id); toast.success(`Key "${name}" revoked`); } catch { toast.error("Failed"); }
    };

    const handleCopy = () => {
        if (revealedKey) { navigator.clipboard.writeText(revealedKey); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success("Copied"); }
    };

    return (
        <div className="space-y-6 max-w-3xl animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage API keys for programmatic access.</p>
                </div>
                <DashButton onClick={() => setShowCreate(true)} icon={<Plus className="w-4 h-4" />}>New Key</DashButton>
            </div>

            {/* Revealed key */}
            {revealedKey && (
                <DashCard glow="amber" className="p-5 space-y-3 border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Save your API key now — you won&apos;t see it again</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2.5 text-sm font-mono bg-card/60 rounded-lg border border-border/30 select-all break-all">{revealedKey}</code>
                        <button onClick={handleCopy} className="p-2.5 hover:bg-muted/30 rounded-lg transition-colors shrink-0">
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </button>
                    </div>
                    <button onClick={() => setRevealedKey(null)} className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
                        I&apos;ve saved it — dismiss
                    </button>
                </DashCard>
            )}

            {/* Create form */}
            {showCreate && !revealedKey && (
                <DashCard variant="accent" className="p-5 space-y-4">
                    <h3 className="font-semibold text-sm">Create API Key</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 block mb-1.5">Name</label>
                            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                                placeholder="e.g. CI/CD Pipeline, My Script"
                                className="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-card/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
                        </div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={isTest} onChange={e => setIsTest(e.target.checked)} className="rounded" />
                            <span>Test mode</span>
                            <span className="text-[10px] text-muted-foreground/40">(no real submissions, no credits)</span>
                        </label>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <DashButton variant="ghost" onClick={() => setShowCreate(false)}>Cancel</DashButton>
                        <DashButton onClick={handleCreate} loading={creating} disabled={!newKeyName.trim()} icon={<Key className="w-4 h-4" />}>Generate</DashButton>
                    </div>
                </DashCard>
            )}

            {/* Keys list */}
            {keys.length === 0 ? (
                <DashCard variant="ghost" className="p-16 text-center">
                    <Key className="w-10 h-10 mx-auto mb-4 text-muted-foreground/15" />
                    <p className="text-base font-semibold text-muted-foreground/50">No API keys yet</p>
                    <p className="text-xs text-muted-foreground/30 mt-1.5">Create your first key to use the IndexFast API.</p>
                </DashCard>
            ) : (
                <div className="space-y-2">
                    {keys.map(key => (
                        <DashCard key={key.id} hoverable className="p-4 flex items-center gap-4 group">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${key.isTest ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                                <Key className={`w-4 h-4 ${key.isTest ? "text-amber-400" : "text-emerald-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold">{key.name}</p>
                                    {key.isTest && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-400">TEST</span>}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground/40 mt-0.5">
                                    <span className="font-mono">{key.keyPrefix}...{key.keyLast4}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}</span>
                                    {key.lastUsedAt && <><span>•</span><span>Used {formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}</span></>}
                                </div>
                            </div>
                            <button onClick={() => handleRevoke(key.id, key.name)}
                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-md text-muted-foreground/40 hover:text-red-400 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </DashCard>
                    ))}
                </div>
            )}

            {/* Documentation / Quick Start */}
            <DashCard className="p-0 overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
                <div className="bg-primary/5 border-b border-border/50 p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">API Quick Start</h3>
                        <p className="text-[11px] text-muted-foreground">Programmatic indexing for your workflows</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Base Endpoint</label>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-border/20 font-mono text-xs">
                            <Globe className="w-3 h-3 text-muted-foreground" />
                            <span className="text-primary/70">{process.env.NEXT_PUBLIC_APP_URL || 'https://indexfast.dev'}/api/v1/urls/submit</span>
                        </div>
                    </div>

                    {sites.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Your Site IDs</label>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                {sites.map(site => (
                                    <div key={site.id} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border/10 text-[10px]">
                                        <span className="font-medium text-muted-foreground truncate max-w-[120px]">{site.domain}</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-primary/60 font-mono">{site.id}</code>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(site.id);
                                                    toast.success("ID copied");
                                                }}
                                                className="hover:text-primary transition-colors"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">cURL Example</label>
                        <div className="relative group">
                            <pre className="text-xs font-mono bg-[#0D0E11] p-5 rounded-xl border border-white/5 overflow-x-auto text-emerald-400/80 leading-relaxed">
{`curl -X POST https://indexfast.dev/api/v1/urls/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "site_id": "your-site-id",
    "urls": ["https://example.com/page-1"]
  }'`}
                            </pre>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(`curl -X POST https://indexfast.dev/api/v1/urls/submit \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "site_id": "your-site-id",\n    "urls": ["https://example.com/page-1"]\n  }'`);
                                    toast.success("Example copied");
                                }}
                                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Copy className="w-4 h-4 text-emerald-400/50" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-300/70 leading-normal">
                            All API requests must be sent over HTTPS. Programmatic access requires a <span className="text-blue-400 font-semibold">Pro</span> or <span className="text-blue-400 font-semibold">Business</span> subscription. Credits are deducted per successful URL submission.
                        </p>
                    </div>
                </div>
            </DashCard>
        </div>
    );
}
