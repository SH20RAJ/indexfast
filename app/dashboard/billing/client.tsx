"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  CreditCard, 
  Zap, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createCustomerPortalSession } from "@/app/actions/portal";

// Should ideally match schema types but simplified here
interface BillingClientProps {
  user: any;
  subscription: any;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 100,
  business: 1000,
};

export function BillingClient({ user, subscription }: BillingClientProps) {
  const [loading, setLoading] = useState(false);

  // Derive plan details
  const currentPlan = user.plan || "free";
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  const totalCredits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || 10;
  // Calculate percentage used (inverse of remaining)
  // Credits field stores *remaining* credits usually based on implementation
  const remainingCredits = user.credits ?? 0;
  const creditsUsed = Math.max(0, totalCredits - remainingCredits);
  const usagePercentage = Math.min(100, (creditsUsed / totalCredits) * 100);

  // Derive subscription status
  const isFree = currentPlan === "free";
  const status = subscription?.status || (isFree ? "active" : "inactive");
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd;
  const renewalDate = user.planExpiresAt ? new Date(user.planExpiresAt) : null;

  const handlePortalAccess = async () => {
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
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground mt-2">Manage your plan, payment methods, and monitor usage.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CURRENT PLAN CARD */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Current Plan
                  {!isFree && (
                    <Badge variant={status === 'active' ? 'default' : 'destructive'} className="ml-2 capitalize">
                      {status}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  You are currently on the <span className="font-semibold text-foreground">{planName}</span> plan.
                </CardDescription>
              </div>
              <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {isFree ? "Free" : (currentPlan === 'pro' ? "$19/mo" : "$49/mo")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize flex items-center gap-1">
                  {cancelAtPeriodEnd ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Cancels on {renewalDate ? format(renewalDate, "MMM d, yyyy") : "expiry"}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {isFree ? "Active" : "Renews automatically"}
                    </>
                  )}
                </span>
              </div>
              {renewalDate && !isFree && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {cancelAtPeriodEnd ? "Expires On" : "Next Billing Date"}
                  </span>
                  <span className="font-medium">
                    {format(renewalDate, "MMMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20">
            {isFree ? (
              <Button asChild className="w-full sm:w-auto">
                <a href="/pricing">Upgrade Plan</a>
              </Button>
            ) : (
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  onClick={handlePortalAccess} 
                  disabled={loading} 
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Manage Subscription"
                  )}
                </Button>
                {/* Upgrade options could also be here if we want to upsell Pro -> Business */}
                {currentPlan === 'pro' && (
                   <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <a href="/pricing">Upgrade to Business</a>
                   </Button>
                )}
              </div>
            )}
          </CardFooter>
        </Card>

        {/* USAGE CARD */}
        <Card className="flex flex-col">
          <CardHeader>
             <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Usage Credits
                </CardTitle>
                <CardDescription>
                  Daily submission credits based on your plan.
                </CardDescription>
              </div>
              <div className="bg-orange-500/10 p-2 rounded-full hidden sm:block">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Daily Credits</span>
                <span>{remainingCredits} / {totalCredits} remaining</span>
              </div>
              {/* Progress bar relies on USED percentage */}
               {/* Wait, progress usually shows how much is consumed. 
                   If user has 8/10 remaining, they used 2/10 = 20%. 
                   So value={20} shows 20% filled. 
               */}
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground pt-1">
                Credits refresh daily. Upgrade to increase your limit.
              </p>
            </div>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-muted-foreground"/>
                   Reset Period
                 </span>
                 <span className="font-medium">Every 24 Hours</span>
               </div>
               {isFree && (
                 <div className="text-sm bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                    You are on the Free plan limits. 
                    <a href="/pricing" className="font-bold hover:underline ml-1">Upgrade to Pro</a> for 10x more capacity.
                 </div>
               )}
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20">
             <Button variant="ghost" asChild className="w-full sm:w-auto">
                <a href="/dashboard">View Submission History &rarr;</a>
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
