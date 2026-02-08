"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Plus, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Site {
  siteUrl: string;
  permissionLevel: string;
}

interface ImportedSite {
  id: string;
  gsc_site_url: string;
  domain: string;
}

export default function SitesManager() {
  const [gscSites, setGscSites] = useState<Site[]>([]);
  const [importedSites, setImportedSites] = useState<ImportedSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.provider_token) return;

      try {
        // Fetch GSC Sites
        const gscRes = await fetch(
          "https://www.googleapis.com/webmasters/v3/sites",
          {
            headers: { Authorization: `Bearer ${session.provider_token}` },
          },
        );
        const gscData = await gscRes.json() as any;
        if (gscData.siteEntry) {
          setGscSites(gscData.siteEntry);
        }

        // Fetch DB Sites
        const { data: dbSites } = await supabase.from("sites").select("*");
        if (dbSites) setImportedSites(dbSites);
      } catch (error) {
        console.error("Failed to fetch sites", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleImport = async (siteUrl: string) => {
    setActioning(siteUrl);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("sites")
      .upsert(
        {
          user_id: user.id,
          domain: siteUrl,
          gsc_site_url: siteUrl,
          permission_level: "siteOwner",
        },
        { onConflict: "user_id, gsc_site_url" },
      )
      .select();

    if (error) {
      console.error("Error importing site", error);
    } else if (data) {
      setImportedSites((prev) => [...prev, data[0] as ImportedSite]);
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

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {gscSites.map((site) => {
        const isImported = importedSites.some(
          (s) => s.gsc_site_url === site.siteUrl,
        );
        return (
          <Card key={site.siteUrl}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle
                  className="truncate text-base font-medium"
                  title={site.siteUrl}
                >
                  {site.siteUrl.replace("sc-domain:", "")}
                </CardTitle>
                {isImported && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    <Check className="w-3 h-3 mr-1" /> Active
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {site.permissionLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              {isImported ? (
                <div className="text-sm text-muted-foreground">
                  Ready to auto-index.
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Connect to start indexing.
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!isImported ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleImport(site.siteUrl)}
                  disabled={actioning === site.siteUrl}
                >
                  {actioning === site.siteUrl ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Import
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleSync(site.siteUrl)}
                  disabled={actioning === site.siteUrl}
                >
                  {actioning === site.siteUrl ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync & Index
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
