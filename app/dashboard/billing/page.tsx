

import { redirect } from "next/navigation";
import { getBillingData } from "@/app/actions/billing";
import { BillingClient } from "./client";

import { Metadata } from "next";
import baseMetadata from "@/lib/metadata";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Billing",
  description: "Manage your subscription and billing.",
};

export default async function BillingPage() {
  const data = await getBillingData();

  if (!data || !data.user) {
    // Ideally user shouldn't be here if not authed, middleware handles it usually
    // But as a fallback:
    return redirect("/login");
  }

  return <BillingClient user={data.user} subscription={data.subscription} />;
}
