import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Pricing } from "@/components/landing/pricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function BillingPage() {
  const user = await stackServerApp.getUser();
  if (!user) redirect("/login");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  });

  if (!dbUser) redirect("/login");

  return (
    <div className="container max-w-4xl py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and credits.</p>
      </div>

      <Card className="border-2 border-zinc-900 dark:border-white shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white">
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
          <CardDescription>Details about your current active plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Active Plan:</span>
            <Badge variant="outline" className="capitalize text-lg border-2 border-zinc-900 dark:border-white">
              {dbUser.plan}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Remaining Credits:</span>
            <span className="text-2xl font-bold">{dbUser.credits}</span>
          </div>
          {dbUser.planExpiresAt && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Next Renewal:</span>
              <span>{new Date(dbUser.planExpiresAt).toLocaleDateString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-10">
        <h2 className="text-2xl font-bold mb-6">Upgrade or Switch Plans</h2>
        <Pricing isAuthenticated={true} currentPlan={dbUser.plan as any} />
      </div>
    </div>
  );
}
