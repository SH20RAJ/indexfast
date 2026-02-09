"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Plus, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        {/* Simple Add Site Form since GSC is disabled for now */}
        <div className="flex gap-2 max-w-md">
            {/* Input would go here, but for now effectively we just show the list */}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {importedSites.map((site) => (
            <Card key={site.id}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="truncate text-base font-medium">
                            {site.domain}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Check className="w-3 h-3 mr-1" /> Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                     <div className="text-sm text-muted-foreground">
                        Ready to auto-index.
                    </div>
                </CardContent>
                <CardFooter>
                     <Button
                        variant="default"
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
                    </Button>
                </CardFooter>
            </Card>
        ))}
        {importedSites.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                <p>No sites connected yet.</p>
                {/* We need a manual add button since GSC is missing */}
                <Button className="mt-4" onClick={() => {
                    const url = prompt("Enter site URL (e.g., https://example.com):");
                    if (url) handleImport(url);
                }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Site Manually
                </Button>
            </div>
        )}
        </div>
    </div>
  );
}
