"use client";

import { useState, useMemo } from "react";
import { CreativeCard } from "@/components/ui/creative-card";
import { Download, Filter, Search, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Submission {
    id: string;
    url: string;
    status: number;
    submittedAt: string;
}

export default function HistoryClient({ 
    site, 
    submissions 
}: { 
    site: { domain: string };
    submissions: Submission[];
}) {
    const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = useMemo(() => {
        let result = submissions;
        if (statusFilter === "success") result = result.filter(s => s.status >= 200 && s.status < 300);
        if (statusFilter === "failed") result = result.filter(s => s.status < 200 || s.status >= 300);
        if (searchQuery) result = result.filter(s => s.url.toLowerCase().includes(searchQuery.toLowerCase()));
        return result;
    }, [submissions, statusFilter, searchQuery]);

    const successCount = submissions.filter(s => s.status >= 200 && s.status < 300).length;
    const failedCount = submissions.length - successCount;

    const exportCSV = () => {
        const header = "URL,Status,Submitted At\n";
        const rows = filtered.map(s => 
            `"${s.url}",${s.status},"${new Date(s.submittedAt).toISOString()}"`
        ).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${site.domain}-submissions.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-handwritten tracking-tight">History</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Submission log for <strong>{site.domain}</strong>
                    </p>
                </div>
                <button
                    onClick={exportCSV}
                    disabled={filtered.length === 0}
                    className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <CreativeCard className="p-4 text-center">
                    <p className="text-2xl font-bold font-handwritten">{submissions.length}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
                </CreativeCard>
                <CreativeCard className="p-4 text-center">
                    <p className="text-2xl font-bold font-handwritten text-emerald-500">{successCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Success</p>
                </CreativeCard>
                <CreativeCard className="p-4 text-center">
                    <p className="text-2xl font-bold font-handwritten text-red-500">{failedCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Failed</p>
                </CreativeCard>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Filter by URL..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg border">
                    {(["all", "success", "failed"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                                statusFilter === f
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <CreativeCard className="p-12 text-center text-muted-foreground border-dashed">
                    <p className="font-handwritten text-lg">No submissions found</p>
                    <p className="text-xs mt-2">
                        {submissions.length === 0 
                            ? "Submit URLs to see them here." 
                            : "Try adjusting your filters."
                        }
                    </p>
                </CreativeCard>
            ) : (
                <CreativeCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">URL</th>
                                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground w-24">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground w-40">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(sub => (
                                    <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {sub.status >= 200 && sub.status < 300 
                                                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 
                                                    : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                }
                                                <span className="font-mono text-xs truncate max-w-md">{sub.url}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                sub.status >= 200 && sub.status < 300
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-red-500/10 text-red-500"
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CreativeCard>
            )}
        </div>
    );
}
