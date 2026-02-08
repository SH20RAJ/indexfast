/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
	interface Env {
		ASSETS: Fetcher;
	}
}
interface CloudflareEnv extends Cloudflare.Env {}
