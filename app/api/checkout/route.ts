import { Checkout } from "@dodopayments/nextjs";
import { stackServerApp } from "@/stack/server";

export const POST = async (req: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { productId, planTier } = await req.json();

  const payload = {
    customer: {
        email: user.primaryEmail || "",
        metadata: {
            userId: user.id,
            planTier: planTier
        }
    },
    product_cart: [
        {
            product_id: productId,
            quantity: 1
        }
    ],
    metadata: {
        userId: user.id,
        planTier: planTier
    }
  };

  return Checkout({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as any) || "test_mode",
    type: "session",
  })(payload as any);
};
