"use client";

import { useState } from "react";
import { DashCard } from "@/components/dashboard/dash-card";
import { DashButton } from "@/components/dashboard/dash-button";
import { Send, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubmitClient({ site }: { site: { id: string; domain: string; gscSiteUrl: string } }) {
    const router = useRouter();
    const [urls, setUrls] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const urlList = urls.split("\n").map(u => u.trim()).filter(u => u.length > 0);
    const validUrls = urlList.filter(u => { try { new URL(u); return true; } catch { return false; } });

    const handleSubmit = async () => {
        if (validUrls.length === 0) { toast.error("No valid URLs"); return; }
        setSubmitting(true);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: site.gscSiteUrl, manualUrls: validUrls }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Submitted ${result.submitted} URLs`, { description: `Credits remaining: ${result.credits_remaining}` });
                setUrls("");
                router.refresh();
            } else {
                toast.error("Submission failed", { description: result.error || result.message });
            }
        } catch { toast.error("An error occurred"); }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 max-w-3xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Submit URLs</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit pages from <span className="font-medium text-foreground">{site.domain}</span> for instant indexing.
                </p>
            </div>

            {/* Info */}
            <DashCard variant="accent" className="p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium text-primary">How it works</p>
                        <p className="text-xs text-muted-foreground">
                            Each URL is submitted to <strong>IndexNow</strong>, notifying Bing, Yandex & other search engines. 1 credit per URL.
                        </p>
                    </div>
                </div>
            </DashCard>

            {/* Input */}
            <DashCard className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">URLs to Submit</label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={validUrls.length > 0 ? "text-emerald-400 font-bold" : ""}>{validUrls.length}</span>
                        valid{validUrls.length !== 1 ? "" : ""} URL{validUrls.length !== 1 ? "s" : ""}
                        {urlList.length > validUrls.length && (
                            <span className="text-amber-400">({urlList.length - validUrls.length} invalid)</span>
                        )}
                    </div>
                </div>

                <textarea
                    value={urls}
                    onChange={e => setUrls(e.target.value)}
                    placeholder={`https://${site.domain}/page-1\nhttps://${site.domain}/page-2\nhttps://${site.domain}/blog/my-post`}
                    className="w-full min-h-[200px] p-4 text-sm font-mono bg-muted/20 border border-border/50 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/30 transition-all"
                    spellCheck={false}
                />

                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground/60">
                        One URL per line • must start with <code className="px-1 py-0.5 rounded bg-muted/50 text-[10px]">https://</code>
                    </p>
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
        </div>
    );
}
