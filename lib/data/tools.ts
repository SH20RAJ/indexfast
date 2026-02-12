export interface Tool {
  name: string;
  url: string;
  category: "SEO" | "Marketing" | "Analytics" | "CRM" | "Design" | "Other" | "Internal";
  pricing: "Free" | "Freemium" | "Paid";
  da: number;
  score: number;
  priority: "High" | "Medium" | "Low";
  description: string;
  logo?: string; // Optional logo URL
}

export const seoMarketingTools: Tool[] = [
  // Internal Tools
  {
    name: "IndexFast Analytics",
    url: "/dashboard/analytics",
    category: "Internal",
    pricing: "Free",
    da: 0, 
    score: 100,
    priority: "High",
    description: "Our own internal analytics dashboard for tracking performance.",
  },
  {
    name: "Placer Sites",
    url: "/dashboard/sites",
    category: "Internal",
    pricing: "Free",
    da: 0,
    score: 100,
    priority: "High",
    description: "Manage your sites and listings directly from Placer.",
  },

  // SEO Tools
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    category: "SEO",
    pricing: "Free",
    da: 100,
    score: 99,
    priority: "High",
    description: "Essential for monitoring site performance in Google Search.",
  },
  {
    name: "Ahrefs",
    url: "https://ahrefs.com/",
    category: "SEO",
    pricing: "Paid",
    da: 90,
    score: 98,
    priority: "High",
    description: "Comprehensive SEO toolset for backlinks and keyword research.",
  },
  {
    name: "Semrush",
    url: "https://www.semrush.com/",
    category: "SEO",
    pricing: "Freemium",
    da: 90,
    score: 97,
    priority: "High",
    description: "All-in-one marketing toolkit for digital marketing professionals.",
  },
  {
    name: "Moz Pro",
    url: "https://moz.com/",
    category: "SEO",
    pricing: "Paid",
    da: 91,
    score: 92,
    priority: "Medium",
    description: "SEO software for smarter marketing.",
  },
  {
    name: "Screaming Frog SEO Spider",
    url: "https://www.screamingfrog.co.uk/seo-spider/",
    category: "SEO",
    pricing: "Freemium",
    da: 80,
    score: 94,
    priority: "High",
    description: "Website crawler for technical SEO audits.",
  },
   {
    name: "Ubersuggest",
    url: "https://neilpatel.com/ubersuggest/",
    category: "SEO",
    pricing: "Freemium",
    da: 88,
    score: 85,
    priority: "Medium",
    description: "Keyword finder tool by Neil Patel.",
  },
  {
    name: "AnswerThePublic",
    url: "https://answerthepublic.com/",
    category: "SEO",
    pricing: "Freemium",
    da: 78,
    score: 88,
    priority: "Medium",
    description: "Visual keyword research tool for content ideas.",
  },

  // Analytics
  {
    name: "Google Analytics 4",
    url: "https://analytics.google.com/",
    category: "Analytics",
    pricing: "Free",
    da: 100,
    score: 98,
    priority: "High",
    description: "Standard for tracking website traffic and user behavior.",
  },
  {
    name: "Hotjar",
    url: "https://www.hotjar.com/",
    category: "Analytics",
    pricing: "Freemium",
    da: 85,
    score: 90,
    priority: "High",
    description: "Heatmaps and user session recordings.",
  },
  {
    name: "Microsoft Clarity",
    url: "https://clarity.microsoft.com/",
    category: "Analytics",
    pricing: "Free",
    da: 94,
    score: 89,
    priority: "Medium",
    description: "Free user behavior analytics tool.",
  },

  // Marketing & CRM
  {
    name: "HubSpot",
    url: "https://www.hubspot.com/",
    category: "CRM",
    pricing: "Freemium",
    da: 93,
    score: 96,
    priority: "High",
    description: "Inbound marketing, sales, and service software.",
  },
  {
    name: "Mailchimp",
    url: "https://mailchimp.com/",
    category: "Marketing",
    pricing: "Freemium",
    da: 92,
    score: 93,
    priority: "High",
    description: "Email marketing and automation platform.",
  },
  {
    name: "Buffer",
    url: "https://buffer.com/",
    category: "Marketing",
    pricing: "Freemium",
    da: 90,
    score: 89,
    priority: "Medium",
    description: "Social media management tool.",
  },
  {
    name: "Canva",
    url: "https://www.canva.com/",
    category: "Design",
    pricing: "Freemium",
    da: 98,
    score: 95,
    priority: "High",
    description: "Graphic design platform for creating visual content.",
  },
  {
    name: "Figma",
    url: "https://www.figma.com/",
    category: "Design",
    pricing: "Freemium",
    da: 93,
    score: 94,
    priority: "High",
    description: "Interface design tool.",
  },
];
