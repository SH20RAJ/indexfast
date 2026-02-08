# IndexFast ⚡️

**Get Indexed in Minutes, Not Weeks.**

IndexFast is a powerful Micro SaaS that automates content indexing for Google, Bing, and Yandex. By leveraging the official Google Search Console API and the IndexNow protocol, we ensure your new pages are crawled and indexed almost instantly.

## 🚀 Features

- **Instant Indexing**: Push URLs directly to Google, Bing, and Yandex via API.
- **Google Search Console Integration**: One-click import of verified properties.
- **Auto-Sync**: Automatically fetch `sitemap.xml` and submit new URLs daily (Pro).
- **Detailed Analytics**: Track submission history and search engine response codes.
- **Modern UI**: A "handwritten" creative design system with dark mode support.
- **Secure Auth**: Powered by **Stack Auth** and Supabase.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v3 + Shadcn UI + Lucide Icons
- **Auth**: Stack Auth + Supabase (RLS)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Workers (via OpenNext)
- **SEO**: Dynamic Sitemaps, JSON-LD, Open Graph

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sh20raj/indexfast.git
   cd indexfast
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with the following:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STACK_API_KEY=your_stack_api_key
   # Add Google Search Console credentials if running locally
   ```

4. **Run the development server**:
   ```bash
   bun dev
   ```

## 🌐 Deployment to Cloudflare Workers

This project is configured for Cloudflare Workers using `@opennextjs/cloudflare`.

1. **Login to Cloudflare**:

   ```bash
   npx wrangler login
   ```

2. **Deploy**:
   ```bash
   bun run deploy
   ```

## 🏷 Domain Name Suggestions

Based on the brand identity "IndexFast" and the value proposition of speed and SEO:

1. **indexfast.io** - Clean, tech-focused (Top Pick).
2. **getindexfast.com** - Action-oriented, SEO friendly.
3. **indexnow.pro** - leverages the "IndexNow" protocol name.
4. **rapidindex.ai** - Modern, implies automation/AI.
5. **submitfast.app** - Focuses on the utility.
6. **seoindex.fast** - Creative TLD usage.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
