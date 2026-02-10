"use client";

import { useState } from "react";
import { CreativeButton } from "@/components/ui/creative-button";
import { createCustomerPortalSession } from "@/app/actions/portal";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const result = await createCustomerPortalSession();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to open billing portal.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-10">
      <div>
        <h1 className="text-3xl font-bold font-handwritten tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and billing preferences.</p>
      </div>
      
      <div className="p-8 border rounded-lg bg-card shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing & Subscription
        </h2>
        <p className="text-sm text-muted-foreground">
            Manage your subscription, view invoices, and update payment methods via our secure billing portal.
        </p>
        
        <CreativeButton 
            onClick={handleManageSubscription} 
            disabled={loading}
            variant="outline"
        >
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
            ) : (
                "Manage Subscription"
            )}
        </CreativeButton>
      </div>
    </div>
  );
}
