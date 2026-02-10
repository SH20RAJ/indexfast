"use server";

import { stackServerApp } from "@/stack/server";
import { getDodoClient } from "@/lib/dodo-client";
import { getCustomerId } from "@/lib/subscription-utils";

export async function createCustomerPortalSession() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const dodoCustomerId = await getCustomerId(user.id, 'dodo');
    if (!dodoCustomerId) {
       return { success: false, error: "No active billing account found." };
    }

    const dodoClient = getDodoClient();
    const session = await dodoClient.createCustomerPortalSession(dodoCustomerId);

    return { success: true, url: session.session_url };
  } catch (error: any) {
    console.error("Portal session error:", error);
    // Dodo might not have enabled portal or user not found there
    return { success: false, url: "", error: error.message || "Failed to create portal session" };
  }
}
