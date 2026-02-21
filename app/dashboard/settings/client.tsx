"use client";

import { CreditCard, Zap } from "lucide-react";

export default function SettingsClient() {

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
            Billing management is currently disabled. Enjoy your free Pro access during the beta!
        </p>
        
        <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-primary">Beta Version - All Features Free</h3>
            <p className="text-sm text-primary/80 mt-1">
              IndexFast is currently in Beta. All Pro features, including unlimited usage and advanced limits, are unlocked and free for all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
