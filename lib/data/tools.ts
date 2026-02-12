export interface Tool {
  name: string;
  url: string;
  category: "SEO" | "Marketing" | "Analytics" | "CRM" | "Design" | "Sitemap" | "Aggregator" | "Validator" | "Generator" | "Performance" | "Content" | "Internal" | "Other";
  pricing: "Free" | "Freemium" | "Paid";
  da: number;
  score: number;
  priority: "High" | "Medium" | "Low";
  description: string;
  logo?: string;
}

export const seoMarketingTools: Tool[] = [
  // ─── Internal Tools ────────────────────────────────────────────
  { name: "IndexFast Analytics", url: "/dashboard/analytics", category: "Internal", pricing: "Free", da: 0, score: 100, priority: "High", description: "Our own internal analytics dashboard for tracking performance." },
  { name: "IndexFast Sites", url: "/dashboard/sites", category: "Internal", pricing: "Free", da: 0, score: 100, priority: "High", description: "Manage your sites and listings directly from Placer." },

  // ─── SEO Tools ─────────────────────────────────────────────────
  { name: "Google Search Console", url: "https://search.google.com/search-console", category: "SEO", pricing: "Free", da: 100, score: 99, priority: "High", description: "Essential for monitoring site performance in Google Search." },
  { name: "Ahrefs", url: "https://ahrefs.com/", category: "SEO", pricing: "Paid", da: 90, score: 98, priority: "High", description: "Comprehensive SEO toolset for backlinks and keyword research." },
  { name: "Semrush", url: "https://www.semrush.com/", category: "SEO", pricing: "Freemium", da: 90, score: 97, priority: "High", description: "All-in-one marketing toolkit for digital marketing professionals." },
  { name: "Moz Pro", url: "https://moz.com/", category: "SEO", pricing: "Paid", da: 91, score: 92, priority: "Medium", description: "SEO software for smarter marketing." },
  { name: "Screaming Frog SEO Spider", url: "https://www.screamingfrog.co.uk/seo-spider/", category: "SEO", pricing: "Freemium", da: 80, score: 94, priority: "High", description: "Website crawler for technical SEO audits." },
  { name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest/", category: "SEO", pricing: "Freemium", da: 88, score: 85, priority: "Medium", description: "Keyword finder tool by Neil Patel." },
  { name: "AnswerThePublic", url: "https://answerthepublic.com/", category: "SEO", pricing: "Freemium", da: 78, score: 88, priority: "Medium", description: "Visual keyword research tool for content ideas." },
  { name: "Mangools (KWFinder)", url: "https://mangools.com/", category: "SEO", pricing: "Paid", da: 72, score: 86, priority: "Medium", description: "Beginner-friendly SEO suite with keyword difficulty tool." },
  { name: "SpyFu", url: "https://www.spyfu.com/", category: "SEO", pricing: "Freemium", da: 78, score: 84, priority: "Medium", description: "Competitor keyword research and PPC intelligence." },
  { name: "CognitiveSEO", url: "https://cognitiveseo.com/", category: "SEO", pricing: "Paid", da: 65, score: 80, priority: "Medium", description: "SEO toolkit with backlink analysis and content optimization." },
  { name: "Raven Tools", url: "https://raventools.com/", category: "SEO", pricing: "Paid", da: 68, score: 78, priority: "Low", description: "SEO and reporting platform for agencies." },
  { name: "SEOquake", url: "https://www.seoquake.com/", category: "SEO", pricing: "Free", da: 72, score: 82, priority: "Medium", description: "Free browser plugin with on-page SEO audit and SERP overlay." },
  { name: "Woorank", url: "https://www.woorank.com/", category: "SEO", pricing: "Freemium", da: 80, score: 83, priority: "Medium", description: "Instant website review and SEO checker." },
  { name: "SiteGuru", url: "https://www.siteguru.co/", category: "SEO", pricing: "Paid", da: 52, score: 78, priority: "Low", description: "SEO audit tool that gives prioritized recommendations." },

  // ─── Analytics ─────────────────────────────────────────────────
  { name: "Google Analytics 4", url: "https://analytics.google.com/", category: "Analytics", pricing: "Free", da: 100, score: 98, priority: "High", description: "Standard for tracking website traffic and user behavior." },
  { name: "Hotjar", url: "https://www.hotjar.com/", category: "Analytics", pricing: "Freemium", da: 85, score: 90, priority: "High", description: "Heatmaps and user session recordings." },
  { name: "Microsoft Clarity", url: "https://clarity.microsoft.com/", category: "Analytics", pricing: "Free", da: 94, score: 89, priority: "Medium", description: "Free user behavior analytics tool." },
  { name: "Plausible Analytics", url: "https://plausible.io/", category: "Analytics", pricing: "Paid", da: 68, score: 85, priority: "Medium", description: "Privacy-friendly, lightweight analytics alternative to GA." },
  { name: "Fathom Analytics", url: "https://usefathom.com/", category: "Analytics", pricing: "Paid", da: 62, score: 82, priority: "Low", description: "Simple, privacy-first website analytics." },
  { name: "Matomo", url: "https://matomo.org/", category: "Analytics", pricing: "Freemium", da: 80, score: 86, priority: "Medium", description: "Open-source analytics platform (self-hosted or cloud)." },

  // ─── Marketing & CRM ──────────────────────────────────────────
  { name: "HubSpot", url: "https://www.hubspot.com/", category: "CRM", pricing: "Freemium", da: 93, score: 96, priority: "High", description: "Inbound marketing, sales, and service software." },
  { name: "Mailchimp", url: "https://mailchimp.com/", category: "Marketing", pricing: "Freemium", da: 92, score: 93, priority: "High", description: "Email marketing and automation platform." },
  { name: "Buffer", url: "https://buffer.com/", category: "Marketing", pricing: "Freemium", da: 90, score: 89, priority: "Medium", description: "Social media management tool." },
  { name: "ConvertKit", url: "https://convertkit.com/", category: "Marketing", pricing: "Freemium", da: 80, score: 86, priority: "Medium", description: "Email marketing built for creators." },
  { name: "Lemlist", url: "https://lemlist.com/", category: "Marketing", pricing: "Paid", da: 65, score: 80, priority: "Medium", description: "Cold email outreach and sales engagement platform." },

  // ─── Design ────────────────────────────────────────────────────
  { name: "Canva", url: "https://www.canva.com/", category: "Design", pricing: "Freemium", da: 98, score: 95, priority: "High", description: "Graphic design platform for creating visual content." },
  { name: "Figma", url: "https://www.figma.com/", category: "Design", pricing: "Freemium", da: 93, score: 94, priority: "High", description: "Interface design tool." },

  // ─── Sitemap Generators ────────────────────────────────────────
  { name: "XML-Sitemaps.com", url: "https://www.xml-sitemaps.com/", category: "Generator", pricing: "Freemium", da: 85, score: 95, priority: "High", description: "Popular online sitemap generator supporting up to 500 pages free." },
  { name: "Yoast SEO (WordPress)", url: "https://yoast.com/", category: "Generator", pricing: "Freemium", da: 88, score: 94, priority: "High", description: "Auto-generates XML sitemaps for WordPress sites." },
  { name: "Rank Math (WordPress)", url: "https://rankmath.com/", category: "Generator", pricing: "Freemium", da: 75, score: 92, priority: "High", description: "SEO plugin with advanced sitemap generation and schema markup." },
  { name: "SEOptimer Sitemap Generator", url: "https://www.seoptimer.com/sitemap-generator", category: "Generator", pricing: "Free", da: 82, score: 89, priority: "Medium", description: "Free tool to generate XML sitemaps quickly." },
  { name: "MySitemapGenerator", url: "https://www.mysitemapgenerator.com/", category: "Generator", pricing: "Freemium", da: 58, score: 78, priority: "Medium", description: "Create XML, HTML, image, and video sitemaps." },
  { name: "Octopus.do", url: "https://octopus.do/", category: "Generator", pricing: "Freemium", da: 52, score: 80, priority: "Medium", description: "Visual sitemap builder for planning website structure." },
  { name: "Slickplan", url: "https://slickplan.com/", category: "Generator", pricing: "Paid", da: 75, score: 88, priority: "Medium", description: "Visual sitemap builder for planning website architecture." },
  { name: "Writemaps", url: "https://writemaps.com/", category: "Generator", pricing: "Freemium", da: 48, score: 72, priority: "Low", description: "Simple online sitemap creator and planning tool." },
  { name: "InspyderSitemap Creator", url: "https://www.intospyder.com/", category: "Generator", pricing: "Paid", da: 40, score: 70, priority: "Low", description: "Desktop sitemap generator for Windows." },

  // ─── Sitemap Validators ────────────────────────────────────────
  { name: "Google Search Console Sitemaps", url: "https://search.google.com/search-console/sitemaps", category: "Validator", pricing: "Free", da: 100, score: 98, priority: "High", description: "Official tool to submit and validate sitemaps with Google." },
  { name: "Sitechecker Sitemap Validator", url: "https://sitechecker.pro/sitemap-validator/", category: "Validator", pricing: "Freemium", da: 78, score: 90, priority: "High", description: "Check your XML sitemap for errors, broken links, and formatting." },
  { name: "XML Sitemap Validator", url: "https://www.xml-sitemaps.com/validate-xml-sitemap.html", category: "Validator", pricing: "Free", da: 85, score: 88, priority: "Medium", description: "Validate XML sitemaps against the sitemap protocol." },
  { name: "Google Rich Results Test", url: "https://search.google.com/test/rich-results", category: "Validator", pricing: "Free", da: 100, score: 92, priority: "High", description: "Test structured data and schema markup on your pages." },
  { name: "Schema Markup Validator", url: "https://validator.schema.org/", category: "Validator", pricing: "Free", da: 88, score: 85, priority: "Medium", description: "Validate Schema.org structured data on your site." },
  { name: "W3C Markup Validator", url: "https://validator.w3.org/", category: "Validator", pricing: "Free", da: 92, score: 82, priority: "Medium", description: "Check HTML markup validity against web standards." },
  { name: "Robots.txt Tester (GSC)", url: "https://search.google.com/search-console/robots-testing-tool", category: "Validator", pricing: "Free", da: 100, score: 88, priority: "High", description: "Test your robots.txt file using Google's tool." },

  // ─── Performance Tools ─────────────────────────────────────────
  { name: "Google PageSpeed Insights", url: "https://pagespeed.web.dev/", category: "Performance", pricing: "Free", da: 100, score: 96, priority: "High", description: "Analyze page speed and Core Web Vitals with fix suggestions." },
  { name: "GTmetrix", url: "https://gtmetrix.com/", category: "Performance", pricing: "Freemium", da: 82, score: 93, priority: "High", description: "Detailed performance testing with waterfall charts and history." },
  { name: "WebPageTest", url: "https://www.webpagetest.org/", category: "Performance", pricing: "Free", da: 85, score: 90, priority: "Medium", description: "Advanced website speed test from multiple locations." },
  { name: "Lighthouse (Chrome DevTools)", url: "https://developer.chrome.com/docs/lighthouse/", category: "Performance", pricing: "Free", da: 95, score: 94, priority: "High", description: "Automated auditing for performance, accessibility, and SEO." },
  { name: "Pingdom", url: "https://www.pingdom.com/", category: "Performance", pricing: "Paid", da: 88, score: 85, priority: "Medium", description: "Website monitoring and performance testing." },
  { name: "KeyCDN Speed Test", url: "https://tools.keycdn.com/speed", category: "Performance", pricing: "Free", da: 78, score: 80, priority: "Low", description: "Test page speed from 14 locations worldwide." },

  // ─── Content & Keyword Tools ───────────────────────────────────
  { name: "SurferSEO", url: "https://surferseo.com/", category: "Content", pricing: "Paid", da: 70, score: 90, priority: "High", description: "AI-powered content optimization with SERP analysis." },
  { name: "Frase", url: "https://www.frase.io/", category: "Content", pricing: "Paid", da: 65, score: 86, priority: "Medium", description: "AI content optimization and brief creation tool." },
  { name: "MarketMuse", url: "https://www.marketmuse.com/", category: "Content", pricing: "Freemium", da: 68, score: 84, priority: "Medium", description: "AI content planning and optimization platform." },
  { name: "Clearscope", url: "https://www.clearscope.io/", category: "Content", pricing: "Paid", da: 60, score: 85, priority: "Medium", description: "Content optimization for higher search rankings." },
  { name: "Also Asked", url: "https://alsoasked.com/", category: "Content", pricing: "Freemium", da: 55, score: 82, priority: "Medium", description: "Discover People Also Asked questions for any keyword." },
  { name: "Exploding Topics", url: "https://explodingtopics.com/", category: "Content", pricing: "Freemium", da: 65, score: 84, priority: "Medium", description: "Discover trending topics before they take off." },

  // ─── SEO Tool Aggregators ──────────────────────────────────────
  { name: "SmallSEOTools", url: "https://smallseotools.com/", category: "Aggregator", pricing: "Free", da: 88, score: 92, priority: "High", description: "Huge collection of 100+ free SEO and text tools." },
  { name: "Duplichecker", url: "https://www.duplichecker.com/", category: "Aggregator", pricing: "Free", da: 86, score: 90, priority: "High", description: "Plagiarism checker and SEO tool suite." },
  { name: "PrePostSEO", url: "https://www.prepostseo.com/", category: "Aggregator", pricing: "Freemium", da: 84, score: 88, priority: "Medium", description: "175+ free SEO and writing tools." },
  { name: "SEO Review Tools", url: "https://www.seoreviewtools.com/", category: "Aggregator", pricing: "Free", da: 79, score: 87, priority: "Medium", description: "Over 60 real-time SEO tools." },
  { name: "Internet Marketing Ninjas", url: "https://www.internetmarketingninjas.com/tools/", category: "Aggregator", pricing: "Free", da: 75, score: 82, priority: "Medium", description: "Free SEO tools suite from industry veterans." },
  { name: "SEO Toolbox (searchenginereports.net)", url: "https://searchenginereports.net/", category: "Aggregator", pricing: "Free", da: 70, score: 78, priority: "Low", description: "100+ free SEO tools including backlink checker and SERP checker." },
  { name: "Sitechecker", url: "https://sitechecker.pro/", category: "Aggregator", pricing: "Freemium", da: 78, score: 85, priority: "Medium", description: "All-in-one site audit, rank tracking, and backlink monitoring." },
  { name: "JERC SEO Tools", url: "https://www.jerctools.com/", category: "Aggregator", pricing: "Free", da: 42, score: 68, priority: "Low", description: "Collection of free online SEO tools." },
];
