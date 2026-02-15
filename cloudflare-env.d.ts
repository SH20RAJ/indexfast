/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
	interface Env {
		ASSETS: Fetcher;
		DATABASE_URL: string;
	}
}
interface CloudflareEnv extends Cloudflare.Env {}
