"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { CreativeCard } from "@/components/ui/creative-card";
import { Loader2, Plus, Check, RefreshCw, AlertCircle, ToggleLeft, ToggleRight, Globe, X } from "lucide-react";
import { saveSite, toggleAutoIndex } from "@/app/actions/dashboard";

interface ImportedSite {
  id: string;
  gsc_site_url: string;
  domain: string;
  isVerified: boolean;
  autoIndex: boolean;
}

export default function SitesManager({ initialSites }: { initialSites: any[] }) {
  const [importedSites, setImportedSites] = useState<ImportedSite[]>(initialSites || []);
  const [actioning, setActioning] = useState<string | null>(null);

  const handleImport = async (siteUrl: string) => {
    setActioning('import');
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
        alert("Sync failed: " + (result.message || result.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Sync failed");
    }
    setActioning(null);
  };

  const handleToggleAutoIndex = async (site: ImportedSite) => {
      try {
          const newState = !site.autoIndex;
          setImportedSites(prev => prev.map(s => s.id === site.id ? { ...s, autoIndex: newState } : s));
          await toggleAutoIndex(site.id, newState);
      } catch (e) {
          console.error(e);
           setImportedSites(prev => prev.map(s => s.id === site.id ? { ...s, autoIndex: !site.autoIndex } : s));
      }
  }

  const [showGSCModal, setShowGSCModal] = useState(false);
  const [gscSites, setGscSites] = useState<any[]>([]);
  const [loadingGSC, setLoadingGSC] = useState(false);
  
  const openGSCModal = async () => {
      setShowGSCModal(true);
      setLoadingGSC(true);
      try {
           // Dynamic import to avoid server-side issues if any, though here it's a server action
           const { fetchGSCSites } = await import("@/app/actions/dashboard");
           const result = await fetchGSCSites();
           if (result.sites) {
               setGscSites(result.sites);
           } else {
               console.error(result.error);
           }
      } catch (e) {
          console.error(e);
      }
      setLoadingGSC(false);
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-end mb-4">
             <CreativeButton variant="outline" onClick={openGSCModal}>
                <Globe className="w-4 h-4 mr-2" /> Import from GSC
             </CreativeButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {importedSites.map((site) => (
            <CreativeCard key={site.id} className="flex flex-col h-full bg-card relative overflow-hidden group">
                 <div className="flex justify-between items-start gap-2 mb-4">
                    <h3 className="truncate text-lg font-bold font-handwritten flex-1" title={site.domain}>
                        {site.domain}
                    </h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
                        site.isVerified 
                        ? "bg-green-500/10 text-green-600 border-green-500/20" 
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                        {site.isVerified ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        {site.isVerified ? "Verified" : "Unverified"}
                    </div>
                </div>
                
                 <div className="text-sm text-muted-foreground mb-6 flex-grow space-y-2">
                    <p>Ready to sync.</p>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <span className="font-medium text-xs">Auto-Index</span>
                        <button onClick={() => handleToggleAutoIndex(site)} className="text-brand hover:text-brand/80 transition-colors">
                            {site.autoIndex ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                        </button>
                    </div>
                </div>
                
                 <CreativeButton
                    variant="primary"
                    className="w-full"
                    onClick={() => handleSync(site.gsc_site_url)}
                    disabled={actioning === site.gsc_site_url || actioning === 'import'}
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
                <div className="flex justify-center gap-4">
                    <CreativeButton onClick={() => {
                        const url = prompt("Enter site URL (e.g., https://example.com):");
                        if (url) handleImport(url);
                    }} disabled={actioning === 'import'}>
                        {actioning === 'import' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add Manually
                    </CreativeButton>
                    <CreativeButton variant="secondary" onClick={openGSCModal}>
                        <Globe className="w-4 h-4 mr-2" /> Import from GSC
                    </CreativeButton>
                </div>
            </CreativeCard>
        )}
        </div>
        
        {/* Simple Modal for GSC Sites */}
        {showGSCModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="bg-card border rounded-lg shadow-lg max-w-md w-full max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg">Select GSC Property</h3>
                        <button onClick={() => setShowGSCModal(false)}><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1">
                        {loadingGSC ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <div className="space-y-2">
                                {gscSites.map((site) => (
                                    <button
                                        key={site.siteUrl}
                                        className="w-full text-left p-3 hover:bg-muted rounded-md border flex items-center justify-between group"
                                        onClick={() => {
                                            // Handle import
                                            const domain = site.siteUrl.replace("sc-domain:", "");
                                            handleImport(domain); // We can improve this to use the exact gsc url
                                            setShowGSCModal(false);
                                        }}
                                    >
                                        <span className="truncate font-medium">{site.siteUrl}</span>
                                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                                {gscSites.length === 0 && <p className="text-center text-muted-foreground">No sites found.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
