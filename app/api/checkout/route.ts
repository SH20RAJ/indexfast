import { Checkout } from "@dodopayments/nextjs";
import { stackServerApp } from "@/stack/server";
import { getDodoConfig } from "@/lib/dodo-config";

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

  const config = getDodoConfig();

  return Checkout({
    bearerToken: config.apiKey!,
    returnUrl: config.returnUrl,
    environment: config.environment as any,
    type: "session",
  })(payload as any);
};
