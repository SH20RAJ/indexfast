"use client";

import { useState } from "react";
import { createCheckoutSession, type CheckoutPlan } from "@/app/actions/checkout";
import { CreativeButton } from "@/components/ui/creative-button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutButtonProps {
  plan: CheckoutPlan;
  billingPeriod?: 'monthly' | 'yearly';
  children?: React.ReactNode;
  className?: string;
}

/**
 * Client component for Dodo Payments checkout
 * Handles the checkout flow and redirects to Dodo hosted checkout page
 */
export function CheckoutButton({
  plan,
  billingPeriod = 'monthly',
  children,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const result = await createCheckoutSession({ plan, billingPeriod });

      if (!result.success) {
        toast.error(result.error || 'Failed to create checkout session');
        setLoading(false);
        return;
      }

      // Redirect to Dodo Payments checkout page
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        // Keep loading state true during redirect
      } else {
        toast.error('No checkout URL received');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <CreativeButton
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      variant="primary"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        children || `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`
      )}
    </CreativeButton>
  );
}
