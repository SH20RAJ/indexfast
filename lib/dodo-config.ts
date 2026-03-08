
export const getDodoConfig = () => {
    const env = process.env.DODO_PAYMENTS_ENVIRONMENT || "test_mode";
    const isLive = env === "live";

    return {
        apiKey: isLive 
            ? process.env.DODO_PAYMENTS_API_KEY_LIVE 
            : process.env.DODO_PAYMENTS_API_KEY_TEST,
        webhookSecret: isLive 
            ? process.env.DODO_WEBHOOK_SECRET_LIVE 
            : process.env.DODO_WEBHOOK_SECRET_TEST,
        environment: env,
        returnUrl: process.env.DODO_PAYMENTS_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    };
};
