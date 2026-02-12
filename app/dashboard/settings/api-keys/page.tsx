import { listApiKeys, createApiKey, revokeApiKey } from "@/app/actions/api-keys";
import ApiKeysClient from "./api-keys-client";

export default async function ApiKeysPage() {
    const keys = await listApiKeys();
    return <ApiKeysClient initialKeys={JSON.parse(JSON.stringify(keys))} />;
}
