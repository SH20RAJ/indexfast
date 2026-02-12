"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe, Plus, Search, Check } from "lucide-react";

interface SiteInfo {
    id: string;
    domain: string;
    gscSiteUrl: string;
    isVerified: boolean;
}

export function DomainSwitcher({ 
    sites, 
    currentDomain 
}: { 
    sites: SiteInfo[];
    currentDomain?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const activeSite = sites.find(s => s.domain === currentDomain);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = sites.filter(s => 
        s.domain.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (domain: string) => {
        setOpen(false);
        setSearch("");
        // Preserve sub-page context if possible
        const subPage = pathname.match(/\/dashboard\/sites\/[^/]+\/(.+)/)?.[1] || "overview";
        router.push(`/dashboard/sites/${encodeURIComponent(domain)}/${subPage}`);
    };

    return (
        <div ref={ref} className="relative w-full">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left",
                    "hover:bg-muted/50 active:scale-[0.98]",
                    open ? "border-primary/50 bg-muted/50 ring-1 ring-primary/20" : "border-border/50",
                    !activeSite && "text-muted-foreground"
                )}
            >
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                        {activeSite ? activeSite.domain : "Select a property"}
                    </p>
                    {activeSite && (
                        <p className="text-[10px] text-muted-foreground truncate leading-tight">
                            {activeSite.isVerified ? "✓ Verified" : "⚠ Unverified"}
                        </p>
                    )}
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                    open && "rotate-180"
                )} />
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                    {/* Search */}
                    {sites.length > 4 && (
                        <div className="p-2 border-b">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search properties..."
                                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted/50 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Site list */}
                    <div className="max-h-64 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-4">No properties found</p>
                        ) : (
                            filtered.map(site => (
                                <button
                                    key={site.id}
                                    onClick={() => handleSelect(site.domain)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                                        site.domain === currentDomain
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                                        {site.domain.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{site.domain}</p>
                                    </div>
                                    {site.domain === currentDomain && (
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Add property */}
                    <div className="p-1 border-t">
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/dashboard/sites");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add property
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
