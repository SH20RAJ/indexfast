

export interface BacklinkSource {
  name: string;
  url: string;
  type: "Directory" | "Guest Post" | "Community" | "Social" | "Profile" | "Forum" | "Startup Launch" | "Web 2.0";
  da: number;
  score: number;
  priority: "High" | "Medium" | "Low";
  description?: string;
}

export const backlinkSources: BacklinkSource[] = [
  // ─── Directories ───────────────────────────────────────────────
  { name: "Google Business Profile", url: "https://www.google.com/business/", type: "Directory", da: 100, score: 98, priority: "High", description: "Essential for local SEO and Google Maps visibility." },
  { name: "Bing Places", url: "https://www.bingplaces.com/", type: "Directory", da: 94, score: 85, priority: "High", description: "Microsoft's equivalent to Google Business Profile." },
  { name: "Yelp", url: "https://biz.yelp.com/", type: "Directory", da: 94, score: 90, priority: "High", description: "Top review site, crucial for local businesses." },
  { name: "Yellow Pages", url: "https://www.yellowpages.com/", type: "Directory", da: 88, score: 80, priority: "Medium", description: "Traditional directory still relevant for citations." },
  { name: "Clutch.co", url: "https://clutch.co/", type: "Directory", da: 87, score: 88, priority: "High", description: "High-quality directory for B2B service providers." },
  { name: "G2", url: "https://www.g2.com/", type: "Directory", da: 86, score: 89, priority: "High", description: "Leading software review platform." },
  { name: "Capterra", url: "https://www.capterra.com/", type: "Directory", da: 83, score: 85, priority: "High", description: "Popular software review site, great for SaaS." },
  { name: "Crunchbase", url: "https://www.crunchbase.com/", type: "Directory", da: 90, score: 82, priority: "Medium", description: "Database of companies and startups." },
  { name: "Apple Maps Connect", url: "https://mapsconnect.apple.com/", type: "Directory", da: 100, score: 88, priority: "High", description: "List your business on Apple Maps for iOS users." },
  { name: "Foursquare", url: "https://foursquare.com/", type: "Directory", da: 92, score: 78, priority: "Medium", description: "Location data platform used by many apps and search engines." },
  { name: "TrustPilot", url: "https://www.trustpilot.com/", type: "Directory", da: 93, score: 91, priority: "High", description: "Consumer review website with massive trust signals." },
  { name: "BBB (Better Business Bureau)", url: "https://www.bbb.org/", type: "Directory", da: 91, score: 85, priority: "Medium", description: "Accredited business directory for trust and credibility." },
  { name: "Glassdoor", url: "https://www.glassdoor.com/", type: "Directory", da: 91, score: 82, priority: "Medium", description: "Employer review site — great for employer brand backlinks." },
  { name: "Hotfrog", url: "https://www.hotfrog.com/", type: "Directory", da: 72, score: 65, priority: "Low", description: "International business directory for local citations." },
  { name: "Manta", url: "https://www.manta.com/", type: "Directory", da: 80, score: 70, priority: "Medium", description: "Small business directory and review site." },
  { name: "TripAdvisor", url: "https://www.tripadvisor.com/", type: "Directory", da: 93, score: 88, priority: "High", description: "Essential for travel, hospitality, and food businesses." },
  { name: "Superpages", url: "https://www.superpages.com/", type: "Directory", da: 78, score: 65, priority: "Low", description: "Local business listing and yellow pages directory." },

  // ─── Guest Posting / Content ───────────────────────────────────
  { name: "Medium", url: "https://medium.com/", type: "Guest Post", da: 95, score: 92, priority: "High", description: "Publish articles and gain exposure to a wide audience." },
  { name: "LinkedIn Articles", url: "https://www.linkedin.com/", type: "Guest Post", da: 99, score: 95, priority: "High", description: "Publish professional content to your network." },
  { name: "HubSpot Blog", url: "https://blog.hubspot.com/", type: "Guest Post", da: 93, score: 94, priority: "High", description: "Top tier marketing and sales blog." },
  { name: "Business Insider", url: "https://www.businessinsider.com/", type: "Guest Post", da: 94, score: 93, priority: "High", description: "Major business news publication." },
  { name: "TechCrunch", url: "https://techcrunch.com/", type: "Guest Post", da: 93, score: 95, priority: "High", description: "Leading technology media property." },
  { name: "Forbes", url: "https://www.forbes.com/", type: "Guest Post", da: 95, score: 96, priority: "High", description: "Global media company, highly authoritative." },
  { name: "Entrepreneur", url: "https://www.entrepreneur.com/", type: "Guest Post", da: 91, score: 90, priority: "High", description: "Focuses on entrepreneurship and small business." },
  { name: "Dev.to", url: "https://dev.to/", type: "Guest Post", da: 80, score: 88, priority: "High", description: "Developer community for publishing tech articles." },
  { name: "Hashnode", url: "https://hashnode.com/", type: "Guest Post", da: 72, score: 82, priority: "Medium", description: "Blogging platform for developers with custom domains." },
  { name: "HackerNoon", url: "https://hackernoon.com/", type: "Guest Post", da: 76, score: 85, priority: "Medium", description: "Technology publishing platform with large readership." },

  // ─── Communities ───────────────────────────────────────────────
  { name: "Reddit (r/SEO)", url: "https://www.reddit.com/r/SEO/", type: "Community", da: 91, score: 88, priority: "High", description: "Discuss SEO strategies and trends." },
  { name: "Reddit (r/BigSEO)", url: "https://www.reddit.com/r/bigseo/", type: "Community", da: 91, score: 85, priority: "Medium", description: "Advanced SEO discussions." },
  { name: "Reddit (r/Entrepreneur)", url: "https://www.reddit.com/r/Entrepreneur/", type: "Community", da: 91, score: 87, priority: "High", description: "Large community of entrepreneurs." },
  { name: "Reddit (r/SaaS)", url: "https://www.reddit.com/r/SaaS/", type: "Community", da: 91, score: 86, priority: "High", description: "Software as a Service discussions." },
  { name: "Indie Hackers", url: "https://www.indiehackers.com/", type: "Community", da: 76, score: 80, priority: "Medium", description: "Community of independent developers and entrepreneurs." },
  { name: "Product Hunt", url: "https://www.producthunt.com/", type: "Community", da: 85, score: 90, priority: "High", description: "Launch new products and get feedback." },
  { name: "Hacker News", url: "https://news.ycombinator.com/", type: "Community", da: 90, score: 85, priority: "Medium", description: "Tech and startup news aggregator by Y Combinator." },
  { name: "Quora", url: "https://www.quora.com/", type: "Community", da: 93, score: 85, priority: "Medium", description: "Q&A platform for long-tail traffic and brand authority." },
  { name: "GrowthHackers", url: "https://growthhackers.com/", type: "Community", da: 68, score: 78, priority: "Medium", description: "Community focused on growth marketing strategies." },
  { name: "Lobsters", url: "https://lobste.rs/", type: "Community", da: 65, score: 72, priority: "Low", description: "Niche computing-focused link aggregator with quality discussion." },

  // ─── Profile Creation ──────────────────────────────────────────
  { name: "GitHub", url: "https://github.com/", type: "Profile", da: 96, score: 95, priority: "High", description: "Essential for developers, high authority profile link." },
  { name: "Behance", url: "https://www.behance.net/", type: "Profile", da: 96, score: 94, priority: "High", description: "Showcase creative work and get a high DA backlink." },
  { name: "About.me", url: "https://about.me/", type: "Profile", da: 92, score: 88, priority: "High", description: "Create a personal homepage and link to your site." },
  { name: "Gravatar", url: "https://en.gravatar.com/", type: "Profile", da: 94, score: 90, priority: "High", description: "Globally recognized avatar profile." },
  { name: "Dribbble", url: "https://dribbble.com/", type: "Profile", da: 93, score: 90, priority: "High", description: "Design portfolio platform." },
  { name: "Ted.com", url: "https://www.ted.com/", type: "Profile", da: 93, score: 89, priority: "Medium", description: "Create a profile on the TED community." },
  { name: "Issuu", url: "https://issuu.com/", type: "Profile", da: 94, score: 85, priority: "Medium", description: "Digital publishing platform." },
  { name: "Goodreads", url: "https://www.goodreads.com/", type: "Profile", da: 93, score: 85, priority: "Medium", description: "Book review site for authors and readers." },
  { name: "Stack Overflow", url: "https://stackoverflow.com/", type: "Profile", da: 94, score: 92, priority: "High", description: "Developer Q&A — profile links carry strong authority." },
  { name: "Slideshare", url: "https://www.slideshare.net/", type: "Profile", da: 95, score: 88, priority: "High", description: "Upload presentations with profile and content backlinks." },
  { name: "Pinterest", url: "https://www.pinterest.com/", type: "Profile", da: 94, score: 82, priority: "Medium", description: "Create boards and pins linking back to your content." },
  { name: "Flickr", url: "https://www.flickr.com/", type: "Profile", da: 93, score: 78, priority: "Medium", description: "Photo sharing platform by SmugMug." },
  { name: "Vimeo", url: "https://vimeo.com/", type: "Profile", da: 96, score: 85, priority: "Medium", description: "Video hosting platform with high-DA profile page." },
  { name: "AngelList (Wellfound)", url: "https://wellfound.com/", type: "Profile", da: 90, score: 86, priority: "High", description: "Startup jobs and company profiles with dofollow links." },
  { name: "Wattpad", url: "https://www.wattpad.com/", type: "Profile", da: 92, score: 80, priority: "Medium", description: "Storytelling platform with profile links." },

  // ─── Forums ────────────────────────────────────────────────────
  { name: "Warrior Forum", url: "https://www.warriorforum.com/", type: "Forum", da: 72, score: 75, priority: "Medium", description: "Internet marketing forum with signature backlinks." },
  { name: "WebmasterWorld", url: "https://www.webmasterworld.com/", type: "Forum", da: 68, score: 72, priority: "Medium", description: "Webmaster and SEO discussion forum." },
  { name: "DigitalPoint", url: "https://www.digitalpoint.com/", type: "Forum", da: 67, score: 70, priority: "Low", description: "Digital marketing and webmaster forum." },
  { name: "SitePoint Community", url: "https://www.sitepoint.com/community/", type: "Forum", da: 82, score: 78, priority: "Medium", description: "Web development and design community forum." },
  { name: "Stack Exchange Network", url: "https://stackexchange.com/", type: "Forum", da: 90, score: 85, priority: "High", description: "Network of Q&A sites covering every niche." },

  // ─── Startup Launch Platforms ──────────────────────────────────
  { name: "BetaList", url: "https://betalist.com/", type: "Startup Launch", da: 68, score: 82, priority: "High", description: "Pre-launch platform to get early adopters for your startup." },
  { name: "SaaSHub", url: "https://www.saashub.com/", type: "Startup Launch", da: 65, score: 80, priority: "Medium", description: "Software alternatives and SaaS products directory." },
  { name: "AlternativeTo", url: "https://alternativeto.net/", type: "Startup Launch", da: 81, score: 85, priority: "High", description: "Crowdsourced software recommendations and alternatives." },
  { name: "GetApp", url: "https://www.getapp.com/", type: "Startup Launch", da: 78, score: 83, priority: "Medium", description: "Business software and app discovery platform." },
  { name: "SaaSWorthy", url: "https://www.saasworthy.com/", type: "Startup Launch", da: 55, score: 72, priority: "Low", description: "SaaS product listing and review site." },
  { name: "Launching Next", url: "https://www.launchingnext.com/", type: "Startup Launch", da: 50, score: 68, priority: "Low", description: "Startup directory to discover and list new products." },
  { name: "Startups.fyi", url: "https://www.startups.fyi/", type: "Startup Launch", da: 45, score: 65, priority: "Low", description: "Curated list of startup tools and resources." },
  { name: "ToolFinder", url: "https://toolfinder.co/", type: "Startup Launch", da: 42, score: 62, priority: "Low", description: "Discover and compare business tools." },

  // ─── Web 2.0 Platforms ─────────────────────────────────────────
  { name: "WordPress.com", url: "https://wordpress.com/", type: "Web 2.0", da: 93, score: 88, priority: "High", description: "Create free blog with dofollow links in content." },
  { name: "Blogger", url: "https://www.blogger.com/", type: "Web 2.0", da: 89, score: 82, priority: "Medium", description: "Google's blogging platform — high DA posts." },
  { name: "Tumblr", url: "https://www.tumblr.com/", type: "Web 2.0", da: 99, score: 85, priority: "High", description: "Microblogging platform with extremely high DA." },
  { name: "Weebly", url: "https://www.weebly.com/", type: "Web 2.0", da: 90, score: 78, priority: "Medium", description: "Free website builder with backlink opportunities." },
  { name: "Google Sites", url: "https://sites.google.com/", type: "Web 2.0", da: 97, score: 82, priority: "High", description: "Create free websites hosted on Google's domain." },
  { name: "Notion public pages", url: "https://www.notion.so/", type: "Web 2.0", da: 91, score: 75, priority: "Medium", description: "Publish public Notion pages with links back to your site." },
  { name: "Telegraph (Telegra.ph)", url: "https://telegra.ph/", type: "Web 2.0", da: 87, score: 72, priority: "Medium", description: "Minimalist publishing tool by Telegram." },
];

