"use client";

import { useState, useMemo, useCallback } from "react";
import { DashCard, DashStat } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import {
    Send, Info, Link2, FileText, Globe, Code, CheckCircle2, XCircle,
    AlertTriangle, Zap, Copy, Check, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SubmitMode = "manual" | "sitemap" | "api";
type UrlStatus = "valid" | "invalid" | "duplicate";

interface ParsedUrl {
    url: string;
    status: UrlStatus;
    reason?: string;
}

export default function SubmitClient({ site }: { site: { id: string; domain: string; gscSiteUrl: string } }) {
    const router = useRouter();
    const [mode, setMode] = useState<SubmitMode>("manual");
    const [urls, setUrls] = useState("");
    const [sitemapUrl, setSitemapUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fetchingSitemap, setFetchingSitemap] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [showApiExamples, setShowApiExamples] = useState(false);
    const [priority, setPriority] = useState<"normal" | "high">("normal");

    // Parse & validate URLs
    const parsedUrls: ParsedUrl[] = useMemo(() => {
        const lines = urls.split("\n").map(u => u.trim()).filter(u => u.length > 0);
        const seen = new Set<string>();
        return lines.map(line => {
            try {
                const u = new URL(line);
                if (seen.has(u.href)) {
                    return { url: line, status: "duplicate" as UrlStatus, reason: "Duplicate URL" };
                }
                seen.add(u.href);
                if (!u.protocol.startsWith("http")) {
                    return { url: line, status: "invalid" as UrlStatus, reason: "Must use http(s)" };
                }
                return { url: line, status: "valid" as UrlStatus };
            } catch {
                return { url: line, status: "invalid" as UrlStatus, reason: "Invalid URL format" };
            }
        });
    }, [urls]);

    const validUrls = parsedUrls.filter(u => u.status === "valid");
    const invalidUrls = parsedUrls.filter(u => u.status === "invalid");
    const duplicateUrls = parsedUrls.filter(u => u.status === "duplicate");

    const handleSubmit = async () => {
        if (validUrls.length === 0) { toast.error("No valid URLs to submit"); return; }
        setSubmitting(true);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: site.gscSiteUrl, manualUrls: validUrls.map(u => u.url) }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Submitted ${result.submitted} URLs`, {
                    description: `Credits remaining: ${result.credits_remaining}`
                });
                setUrls("");
                router.refresh();
            } else {
                toast.error("Submission failed", { description: result.error || result.message });
            }
        } catch { toast.error("An error occurred"); }
        setSubmitting(false);
    };

    const handleFetchSitemap = async () => {
        if (!sitemapUrl.trim()) { toast.error("Enter a sitemap URL"); return; }
        try { new URL(sitemapUrl); } catch { toast.error("Invalid sitemap URL"); return; }
        setFetchingSitemap(true);
        try {
            const res = await fetch(sitemapUrl);
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/xml");
            const locs = doc.querySelectorAll("loc");
            const extracted: string[] = [];
            locs.forEach(loc => {
                if (loc.textContent) extracted.push(loc.textContent.trim());
            });
            if (extracted.length > 0) {
                setUrls(prev => {
                    const existing = prev.trim();
                    return existing ? `${existing}\n${extracted.join("\n")}` : extracted.join("\n");
                });
                setMode("manual");
                toast.success(`Extracted ${extracted.length} URLs from sitemap`);
            } else {
                toast.error("No URLs found in sitemap", { description: "Make sure the URL points to a valid XML sitemap." });
            }
        } catch {
            toast.error("Failed to fetch sitemap", { description: "CORS or network error. Try pasting URLs manually." });
        }
        setFetchingSitemap(false);
    };

    const copyToClipboard = useCallback(async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    }, []);

    const curlExample = `curl -X POST https://indexfast.strivio.world/api/v1/urls/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://${site.domain}/page-1",
      "https://${site.domain}/page-2"
    ],
    "priority": "${priority}"
  }'`;

    const jsExample = `const response = await fetch('https://indexfast.strivio.world/api/v1/urls/submit', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    urls: [
      'https://${site.domain}/page-1',
      'https://${site.domain}/page-2',
    ],
    priority: '${priority}',
  }),
});
const data = await response.json();
console.log(data);`;

    const pythonExample = `import requests

response = requests.post(
    'https://indexfast.strivio.world/api/v1/urls/submit',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'urls': [
            'https://${site.domain}/page-1',
            'https://${site.domain}/page-2',
        ],
        'priority': '${priority}',
    }
)
print(response.json())`;

    const modes = [
        { id: "manual" as const, label: "Manual URLs", icon: Link2, desc: "Paste URLs one per line" },
        { id: "sitemap" as const, label: "From Sitemap", icon: Globe, desc: "Import from sitemap.xml" },
        { id: "api" as const, label: "API", icon: Code, desc: "Submit programmatically" },
    ];

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Submit URLs</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit pages from <span className="font-medium text-foreground">{site.domain}</span> for instant indexing via IndexNow.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                <DashStat label="Valid URLs" value={validUrls.length} glow="emerald" />
                <DashStat label="Invalid" value={invalidUrls.length} glow={invalidUrls.length > 0 ? "rose" : "none"} />
                <DashStat label="Duplicates" value={duplicateUrls.length} glow={duplicateUrls.length > 0 ? "amber" : "none"} />
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-muted/20 rounded-xl border border-border/30">
                {modes.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                            mode === m.id
                                ? "bg-card text-foreground shadow-sm border border-border/50"
                                : "text-muted-foreground/60 hover:text-foreground hover:bg-card/50"
                        )}>
                        <m.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{m.label}</span>
                    </button>
                ))}
            </div>

            {/* Manual URL Input */}
            {mode === "manual" && (
                <DashCard className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-semibold">URLs to Submit</label>
                            <p className="text-xs text-muted-foreground/50 mt-0.5">
                                One URL per line • must start with <code className="px-1 py-0.5 rounded bg-muted/50 text-[10px]">https://</code>
                            </p>
                        </div>
                        {/* Priority Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground/50">Priority:</span>
                            <div className="flex items-center gap-0.5 p-0.5 bg-muted/30 rounded-lg border border-border/30">
                                <button onClick={() => setPriority("normal")}
                                    className={cn("px-2 py-1 text-xs font-medium rounded-md transition-all",
                                        priority === "normal" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/50"
                                    )}>Normal</button>
                                <button onClick={() => setPriority("high")}
                                    className={cn("px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                                        priority === "high" ? "bg-amber-500/10 text-amber-400 shadow-sm border border-amber-500/20" : "text-muted-foreground/50"
                                    )}>
                                    <Zap className="w-3 h-3" /> High
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea
                            value={urls}
                            onChange={e => setUrls(e.target.value)}
                            placeholder={`https://${site.domain}/page-1\nhttps://${site.domain}/blog/my-post\nhttps://${site.domain}/products/awesome-tool`}
                            className="w-full min-h-[240px] p-4 text-sm font-mono bg-muted/10 border border-border/50 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/20 transition-all"
                            spellCheck={false}
                        />
                        {/* Line count gutter */}
                        <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground/30 font-mono">
                            {parsedUrls.length > 0 ? `${parsedUrls.length} line${parsedUrls.length !== 1 ? "s" : ""}` : ""}
                        </div>
                    </div>

                    {/* URL validation feedback */}
                    {parsedUrls.length > 0 && (invalidUrls.length > 0 || duplicateUrls.length > 0) && (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {parsedUrls.filter(u => u.status !== "valid").map((u, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-muted/10">
                                    {u.status === "invalid"
                                        ? <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                        : <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                    }
                                    <span className="truncate font-mono text-muted-foreground">{u.url}</span>
                                    <span className="text-muted-foreground/40 ml-auto">{u.reason}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3">
                            {validUrls.length > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="font-medium">{validUrls.length} ready to submit</span>
                                </div>
                            )}
                        </div>
                        <DashButton
                            onClick={handleSubmit}
                            disabled={validUrls.length === 0}
                            loading={submitting}
                            icon={<Send className="w-4 h-4" />}
                        >
                            Submit {validUrls.length > 0 ? validUrls.length : ""} URL{validUrls.length !== 1 ? "s" : ""}
                        </DashButton>
                    </div>
                </DashCard>
            )}

            {/* Sitemap Import */}
            {mode === "sitemap" && (
                <DashCard className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold">Sitemap URL</label>
                        <p className="text-xs text-muted-foreground/50 mt-0.5">
                            Enter your sitemap.xml URL and we&apos;ll extract all URLs from it.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={sitemapUrl}
                            onChange={e => setSitemapUrl(e.target.value)}
                            placeholder={`https://${site.domain}/sitemap.xml`}
                            className="flex-1 px-4 py-2.5 text-sm font-mono bg-muted/10 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <DashButton
                            onClick={handleFetchSitemap}
                            loading={fetchingSitemap}
                            icon={<Globe className="w-4 h-4" />}
                        >
                            Fetch & Extract
                        </DashButton>
                    </div>

                    <DashCard variant="accent" className="p-3">
                        <div className="flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-primary">How sitemap import works</p>
                                <ul className="text-[11px] text-muted-foreground/60 space-y-0.5 list-disc list-inside">
                                    <li>We fetch your sitemap and extract all <code className="px-1 py-0.5 rounded bg-muted/30 text-[10px]">&lt;loc&gt;</code> tags</li>
                                    <li>URLs are loaded into the manual editor for review</li>
                                    <li>You can remove or add URLs before submitting</li>
                                    <li>Supports standard XML sitemaps and sitemap indexes</li>
                                </ul>
                            </div>
                        </div>
                    </DashCard>

                    <div className="pt-1">
                        <p className="text-xs text-muted-foreground/30">
                            Common sitemap locations:
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {["/sitemap.xml", "/sitemap_index.xml", "/sitemap-0.xml", "/post-sitemap.xml"].map(path => (
                                <button key={path}
                                    onClick={() => setSitemapUrl(`https://${site.domain}${path}`)}
                                    className="px-2 py-1 text-[10px] font-mono bg-muted/20 border border-border/30 rounded-md hover:bg-muted/40 transition-colors">
                                    {path}
                                </button>
                            ))}
                        </div>
                    </div>
                </DashCard>
            )}

            {/* API Mode */}
            {mode === "api" && (
                <div className="space-y-4">
                    <DashCard variant="accent" className="p-4">
                        <div className="flex items-start gap-3">
                            <Code className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-primary">API Submission</p>
                                <p className="text-xs text-muted-foreground">
                                    Submit URLs programmatically using our REST API. Generate an API key in{" "}
                                    <a href="/dashboard/settings/api-keys" className="text-primary hover:underline">Settings → API Keys</a>.
                                </p>
                            </div>
                        </div>
                    </DashCard>

                    {/* Endpoint Info */}
                    <DashCard className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">POST</Badge>
                            <code className="text-sm font-mono text-foreground">/api/v1/urls/submit</code>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                                <p className="font-semibold text-muted-foreground/50 uppercase tracking-wider text-[10px]">Headers</p>
                                <div className="font-mono p-2 bg-muted/10 rounded-md space-y-0.5 text-muted-foreground/70">
                                    <p>Authorization: Bearer YOUR_KEY</p>
                                    <p>Content-Type: application/json</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-muted-foreground/50 uppercase tracking-wider text-[10px]">Body Parameters</p>
                                <div className="font-mono p-2 bg-muted/10 rounded-md space-y-0.5 text-muted-foreground/70">
                                    <p>urls: string[] <span className="text-rose-400">*required</span></p>
                                    <p>priority: &quot;normal&quot; | &quot;high&quot;</p>
                                </div>
                            </div>
                        </div>
                    </DashCard>

                    {/* Code Examples */}
                    <button
                        onClick={() => setShowApiExamples(!showApiExamples)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/10 border border-border/30 rounded-lg transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Code Examples
                        {showApiExamples ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                    </button>

                    {showApiExamples && (
                        <div className="space-y-3">
                            {[
                                { label: "cURL", key: "curl", code: curlExample },
                                { label: "JavaScript", key: "js", code: jsExample },
                                { label: "Python", key: "python", code: pythonExample },
                            ].map(ex => (
                                <DashCard key={ex.key} className="overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-muted/10">
                                        <span className="text-xs font-semibold">{ex.label}</span>
                                        <button
                                            onClick={() => copyToClipboard(ex.code, ex.key)}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {copied === ex.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            {copied === ex.key ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <pre className="p-4 text-xs font-mono overflow-x-auto text-muted-foreground/70 leading-relaxed">
                                        <code>{ex.code}</code>
                                    </pre>
                                </DashCard>
                            ))}
                        </div>
                    )}

                    {/* Rate Limits */}
                    <DashCard variant="ghost" className="p-4">
                        <div className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                            <div className="text-xs text-muted-foreground/40 space-y-0.5">
                                <p className="font-medium text-muted-foreground/60">Rate Limits</p>
                                <p>Free: 100 req/hr • Pro: 1,000 req/hr • Enterprise: 10,000 req/hr</p>
                                <p>Max 100 URLs per request • 1 credit per URL submitted</p>
                            </div>
                        </div>
                    </DashCard>
                </div>
            )}

            {/* Info Banner */}
            <DashCard variant="ghost" className="p-3">
                <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground/30 leading-relaxed">
                        URLs are submitted to <strong>IndexNow</strong>, instantly notifying Bing, Yandex, Seznam, Naver and other participating search engines.
                        Each URL costs 1 credit. Check your <a href="/dashboard/billing" className="text-primary/60 hover:text-primary hover:underline">billing dashboard</a> for remaining credits.
                    </p>
                </div>
            </DashCard>
        </div>
    );
}
