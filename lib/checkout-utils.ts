"use client";

import { toast } from "sonner";

export async function handleCheckout(productId: string, planTier: string) {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, planTier }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate checkout");
    }

    const data = await response.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error("Could not initiate checkout. Please try again later.");
  }
}
