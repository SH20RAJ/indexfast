"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { CreativeCard } from "@/components/ui/creative-card";
import { Loader2, Plus, Check, RefreshCw } from "lucide-react";
import { saveSite } from "@/app/actions/dashboard";

interface ImportedSite {
  id: string;
  gsc_site_url: string;
  domain: string;
}

export default function SitesManager({ initialSites }: { initialSites: any[] }) {
  const [importedSites, setImportedSites] = useState<ImportedSite[]>(initialSites || []);
  const [actioning, setActioning] = useState<string | null>(null);

  const handleImport = async (siteUrl: string) => {
    setActioning(siteUrl);
    try {
        const savedSite = await saveSite(siteUrl);
        if (savedSite) {
             setImportedSites((prev) => [...prev, savedSite as unknown as ImportedSite]);
        }
    } catch (e) {
        console.error("Import failed", e);
    }
    setActioning(null);
  };

  const handleSync = async (siteUrl: string) => {
    setActioning(siteUrl);
    try {
      const res = await fetch("/api/sync-sitemaps", {
        method: "POST",
        body: JSON.stringify({ siteUrl }),
      });
      const result = await res.json() as any;
      if (result.success) {
        alert(
          `Synced! Processed: ${result.processed}, Submitted: ${result.submitted}`,
        );
      } else {
        alert("Sync failed: " + result.message || "Unknown error");
      }
    } catch (e) {
      console.error(e);
      alert("Sync failed");
    }
    setActioning(null);
  };

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {importedSites.map((site) => (
            <CreativeCard key={site.id} className="flex flex-col h-full bg-card">
                 <div className="flex justify-between items-start gap-2 mb-4">
                    <h3 className="truncate text-lg font-bold font-handwritten">
                        {site.domain}
                    </h3>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                        <Check className="w-3 h-3 mr-1" /> Active
                    </div>
                </div>
                
                 <div className="text-sm text-muted-foreground mb-6 flex-grow">
                    Ready to auto-index.
                </div>
                
                 <CreativeButton
                    variant="primary"
                    className="w-full"
                    onClick={() => handleSync(site.gsc_site_url)}
                    disabled={actioning === site.gsc_site_url}
                >
                    {actioning === site.gsc_site_url ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sync & Index
                </CreativeButton>
            </CreativeCard>
        ))}
        {importedSites.length === 0 && (
            <CreativeCard className="col-span-full p-8 text-center text-muted-foreground border-dashed">
                <p className="font-handwritten text-xl mb-4">No sites connected yet.</p>
                <CreativeButton onClick={() => {
                    const url = prompt("Enter site URL (e.g., https://example.com):");
                    if (url) handleImport(url);
                }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Site Manually
                </CreativeButton>
            </CreativeCard>
        )}
        </div>
    </div>
  );
}
