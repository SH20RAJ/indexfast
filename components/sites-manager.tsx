"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { CreativeCard } from "@/components/ui/creative-card";
import { Loader2, Plus, Check, RefreshCw, AlertCircle, ToggleLeft, ToggleRight, Globe, X } from "lucide-react";
import Link from "next/link";
import { saveSite, toggleAutoIndex } from "@/app/actions/dashboard";

interface ImportedSite {
  id: string;
  gscSiteUrl: string;
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
      } catch (e: any) {
          console.error(e);
          // Revert state
          setImportedSites(prev => prev.map(s => s.id === site.id ? { ...s, autoIndex: !site.autoIndex } : s));
          
          if (e.message?.includes("requires the pro plan") || e.digest?.includes("requires the pro plan")) {
              if (confirm("Auto-indexing is a Pro feature. Would you like to upgrade now?")) {
                  window.location.href = "/dashboard/billing";
              }
          } else {
              alert("Failed to toggle auto-index: " + (e.message || "Unknown error"));
          }
      }
  }

  const [showGSCModal, setShowGSCModal] = useState(false);
  const [gscSites, setGscSites] = useState<any[]>([]);
  const [loadingGSC, setLoadingGSC] = useState(false);
  const [gscConnected, setGscConnected] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [selectedGscSites, setSelectedGscSites] = useState<string[]>([]);
  const [bulkImporting, setBulkImporting] = useState(false);

  const handleBulkImport = async () => {
      if (selectedGscSites.length === 0) return;
      setBulkImporting(true);
      
      try {
          const sitesToImport = gscSites
              .filter(s => selectedGscSites.includes(s.siteUrl))
              .map(s => ({
                  domain: s.siteUrl.replace("sc-domain:", "").replace("https://", "").replace("http://", "").replace(/\/$/, ""),
                  siteUrl: s.siteUrl,
                  permissionLevel: s.permissionLevel
              }));
          
          const { importGSCSites } = await import("@/app/actions/dashboard");
          const result = await importGSCSites(sitesToImport);
          
          if (result?.success) {
              // Refresh the list of sites
              // In a real app we might want to re-fetch from server or optimistically update.
              // For now, let's just reload the page to be safe and simple or update local state if we had full objects.
              // Let's toggle a reload
              window.location.reload(); 
          }
      } catch (e) {
          console.error("Bulk import failed", e);
          alert("Failed to import selected sites.");
      }
      setBulkImporting(false);
      setShowGSCModal(false);
  };
  
  const openGSCModal = async () => {
      setShowGSCModal(true);
      setLoadingGSC(true);
      setNeedsAuth(false);
      
      try {
           // Check if GSC is connected and fetch sites
           const { fetchGSCSites, checkGSCConnection } = await import("@/app/actions/gsc");
           
           const isConnected = await checkGSCConnection();
           setGscConnected(isConnected);
           
           if (!isConnected) {
               setNeedsAuth(true);
               setLoadingGSC(false);
               return;
           }
           
           const result = await fetchGSCSites();
           
           if (result.needsAuth) {
               setNeedsAuth(true);
               setGscConnected(false);
           } else if (result.sites) {
               setGscSites(result.sites);
           } else {
               console.error(result.error);
           }
      } catch (e) {
          console.error(e);
      }
      setLoadingGSC(false);
  }

  const handleConnectGSC = async () => {
      try {
          const { initiateGoogleOAuth } = await import("@/app/actions/gsc");
          const authUrl = await initiateGoogleOAuth();
          window.location.href = authUrl;
      } catch (e) {
          console.error(e);
      }
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
                        <Link href={`/dashboard/sites/${site.domain}`} className="hover:underline">
                            {site.domain}
                        </Link>
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
                    onClick={() => handleSync(site.gscSiteUrl)}
                    disabled={actioning === site.gscSiteUrl || actioning === 'import'}
                >
                    {actioning === site.gscSiteUrl ? (
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
                    <CreativeButton onClick={() => alert("Feature coming soon! Please use 'Import from GSC' for now.")} variant="outline" className="opacity-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Manually
                    </CreativeButton>
                    <CreativeButton variant="secondary" onClick={openGSCModal}>
                        <Globe className="w-4 h-4 mr-2" /> Import from GSC
                    </CreativeButton>
                </div>
            </CreativeCard>
        )}
        </div>
        
        {/* Enhanced GSC Modal with Multi-Select */}
        {showGSCModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                        <div>
                            <h3 className="font-bold text-lg">Import from Google Search Console</h3>
                            <p className="text-sm text-muted-foreground">Select sites to import into IndexFast</p>
                        </div>
                        <button onClick={() => setShowGSCModal(false)} className="p-1 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="p-0 overflow-hidden flex-1 flex flex-col">
                        {loadingGSC ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-brand" />
                                <p className="text-muted-foreground animate-pulse">Fetching your sites from Google...</p>
                            </div>
                        ) : needsAuth ? (
                            <div className="text-center py-12 px-6 space-y-6 flex flex-col items-center justify-center h-full">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold">Connect Google Search Console</h4>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Link your Google account to automatically import verified sites and sync sitemaps.
                                    </p>
                                </div>
                                <CreativeButton onClick={handleConnectGSC} variant="primary" size="lg" className="w-full max-w-xs">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Connect Google Account
                                </CreativeButton>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 border-b bg-muted/20 flex items-center justify-between sticky top-0 backdrop-blur-sm z-10">
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            id="selectAll"
                                            className="rounded border-gray-300 text-brand focus:ring-brand"
                                            checked={gscSites.length > 0 && selectedGscSites.length === gscSites.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedGscSites(gscSites.map(s => s.siteUrl));
                                                } else {
                                                    setSelectedGscSites([]);
                                                }
                                            }}
                                        />
                                        <label htmlFor="selectAll" className="text-sm font-medium cursor-pointer select-none">
                                            Select All ({gscSites.length})
                                        </label>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {selectedGscSites.length} selected
                                    </span>
                                </div>

                                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                    {gscSites.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            No verified sites found in your Google Search Console account.
                                        </div>
                                    ) : (
                                        gscSites.map((site) => {
                                            const isSelected = selectedGscSites.includes(site.siteUrl);
                                            const isAlreadyImported = importedSites.some(s => s.gscSiteUrl === site.siteUrl);
                                            
                                            // Extract domain for display
                                            const domainDisplay = site.siteUrl.replace("sc-domain:", "").replace("https://", "").replace("http://", "").replace(/\/$/, "");

                                            return (
                                                <div 
                                                    key={site.siteUrl}
                                                    onClick={() => {
                                                        if (isAlreadyImported) return;
                                                        if (isSelected) {
                                                            setSelectedGscSites(prev => prev.filter(url => url !== site.siteUrl));
                                                        } else {
                                                            setSelectedGscSites(prev => [...prev, site.siteUrl]);
                                                        }
                                                    }}
                                                    className={`
                                                        w-full text-left p-3 rounded-md border flex items-center justify-between group transition-all cursor-pointer select-none
                                                        ${isAlreadyImported ? 'bg-muted/50 opacity-60 cursor-not-allowed border-transparent' : 
                                                          isSelected ? 'bg-brand/5 border-brand ring-1 ring-brand' : 'hover:bg-muted border-transparent hover:border-border'}
                                                    `}
                                                >
                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                        <div className={`
                                                            w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                            ${isSelected || isAlreadyImported ? 'bg-brand border-brand text-white' : 'border-input bg-background'}
                                                        `}>
                                                            {(isSelected || isAlreadyImported) && <Check className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="truncate font-bold text-sm">{domainDisplay}</span>
                                                            <span className="truncate text-xs text-muted-foreground">{site.siteUrl}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {isAlreadyImported ? (
                                                        <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground font-medium">Imported</span>
                                                    ) : (
                                                        <div className="text-xs text-muted-foreground">{site.permissionLevel}</div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="p-4 border-t bg-background mt-auto">
                                    <CreativeButton 
                                        onClick={handleBulkImport} 
                                        disabled={selectedGscSites.length === 0 || bulkImporting}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {bulkImporting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Importing {selectedGscSites.length} sites...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Import {selectedGscSites.length} Selected Sites
                                            </>
                                        )}
                                    </CreativeButton>
                                    <p className="text-center text-xs text-muted-foreground mt-2">
                                        Importing will automatically verified sites and enable sitemap syncing.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
