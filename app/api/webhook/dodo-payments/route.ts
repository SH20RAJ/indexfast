import { Webhooks } from "@dodopayments/nextjs";
import { upsertSubscription, setCustomerId } from "@/lib/subscription-utils";
import { getDodoConfig } from "@/lib/dodo-config";

const config = getDodoConfig();

export const POST = Webhooks({
  webhookKey: config.webhookSecret || "YmFzZTY0LWZhbGxiYWNrLXNlY3JldC1mb3ItYnVpbGQ=", // base64 for 'base64-fallback-secret-for-build'
  onPayload: async (payload) => {
    // This runs for every event. Useful for logging.
    console.log("Dodo Webhook received:", payload.type);
  },
  onSubscriptionActive: async (payload) => {
    const data = payload.data as any;
    const { customer, subscription } = data;
    if (customer && subscription) {
        await setCustomerId(customer.metadata?.userId || "", "dodo", customer.customer_id);
        await upsertSubscription({
            id: subscription.subscription_id,
            userId: customer.metadata?.userId || "",
            provider: "dodo",
            status: "active",
            plan: subscription.metadata?.planTier as "pro" | "business" || "pro",
            currentPeriodStart: new Date(subscription.current_period_start),
            currentPeriodEnd: new Date(subscription.current_period_end),
        });
    }
  },
  onSubscriptionRenewed: async (payload) => {
    const data = payload.data as any;
    const { subscription } = data;
    if (subscription) {
        // Logic similar to active but ensuring periodicity
        await upsertSubscription({
          id: subscription.subscription_id,
          userId: subscription.metadata?.userId || "",
          provider: "dodo",
          status: "active",
          plan: subscription.metadata?.planTier as "pro" | "business" || "pro",
          currentPeriodStart: new Date(subscription.current_period_start),
          currentPeriodEnd: new Date(subscription.current_period_end),
        });
    }
  },
  onSubscriptionCancelled: async (payload) => {
      const data = payload.data as any;
      const { subscription } = data;
      if (subscription) {
          await upsertSubscription({
              id: subscription.subscription_id,
              userId: subscription.metadata?.userId || "",
              provider: "dodo",
              status: "canceled",
              plan: subscription.metadata?.planTier as "pro" | "business" || "pro",
              currentPeriodStart: new Date(subscription.current_period_start),
              currentPeriodEnd: new Date(subscription.current_period_end),
              cancelAtPeriodEnd: true
          });
      }
  },
  onSubscriptionExpired: async (payload) => {
      const data = payload.data as any;
      const { subscription } = data;
      if (subscription) {
          // Effectively turns them back to 'free' via upsert logic
          await upsertSubscription({
              id: subscription.subscription_id,
              userId: subscription.metadata?.userId || "",
              provider: "dodo",
              status: "past_due", // or handle as expired
              plan: "pro", // Original plan for history
              currentPeriodStart: new Date(subscription.current_period_start),
              currentPeriodEnd: new Date(subscription.current_period_end),
          });
      }
  }
});
