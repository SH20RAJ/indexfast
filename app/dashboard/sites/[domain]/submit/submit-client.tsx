"use client";

import { useState } from "react";
import { CreativeCard } from "@/components/ui/creative-card";
import { CreativeButton } from "@/components/ui/creative-button";
import { Send, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubmitClient({ site }: { site: { id: string; domain: string; gscSiteUrl: string } }) {
    const router = useRouter();
    const [urls, setUrls] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const urlList = urls
        .split("\n")
        .map(u => u.trim())
        .filter(u => u.length > 0);

    const validUrls = urlList.filter(u => {
        try { new URL(u); return true; } catch { return false; }
    });

    const handleSubmit = async () => {
        if (validUrls.length === 0) {
            toast.error("No valid URLs", { description: "Enter at least one valid URL." });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/sync-sitemaps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    siteUrl: site.gscSiteUrl,
                    manualUrls: validUrls,
                }),
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
        } catch {
            toast.error("An error occurred");
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold font-handwritten tracking-tight">Submit URLs</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit individual pages from <strong>{site.domain}</strong> for instant indexing via IndexNow.
                </p>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-blue-600 dark:text-blue-400 font-medium">How it works</p>
                    <p className="text-muted-foreground">
                        Each URL is submitted to <strong>IndexNow</strong>, notifying Bing, Yandex, and other participating search engines. 
                        Each URL costs 1 credit.
                    </p>
                </div>
            </div>

            {/* Input area */}
            <CreativeCard className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">URLs to Submit</label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={validUrls.length > 0 ? "text-emerald-500 font-bold" : ""}>
                            {validUrls.length}
                        </span>
                        valid URL{validUrls.length !== 1 ? "s" : ""}
                        {urlList.length > validUrls.length && (
                            <span className="text-amber-500">
                                ({urlList.length - validUrls.length} invalid)
                            </span>
                        )}
                    </div>
                </div>

                <textarea
                    value={urls}
                    onChange={e => setUrls(e.target.value)}
                    placeholder={`https://${site.domain}/page-1\nhttps://${site.domain}/page-2\nhttps://${site.domain}/blog/my-post`}
                    className="w-full min-h-[200px] p-4 text-sm font-mono bg-muted/30 border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/40"
                    spellCheck={false}
                />

                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                        One URL per line. Must start with <code className="px-1 py-0.5 rounded bg-muted text-[10px]">https://</code>
                    </p>
                    <CreativeButton
                        onClick={handleSubmit}
                        disabled={validUrls.length === 0 || submitting}
                        variant="primary"
                        className="min-w-[140px]"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit {validUrls.length > 0 ? validUrls.length : ""} URL{validUrls.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </CreativeButton>
                </div>
            </CreativeCard>
        </div>
    );
}
