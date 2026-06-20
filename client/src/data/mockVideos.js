export const categories = [
  "All",
  "Design",
  "Engineering",
  "Cinema",
  "Startups",
  "AI",
  "Product",
];

export const videos = [
  {
    id: "studio-os",
    title: "Designing a creator operating system",
    creator: "Avery Stone",
    username: "avery",
    category: "Design",
    duration: "12:48",
    views: "2.4M",
    likes: "84K",
    subscribers: "812K",
    accent: "from-zinc-950 via-zinc-800 to-stone-200",
    description:
      "A calm breakdown of premium product surfaces, dashboard density, and content workflows.",
  },
  {
    id: "api-craft",
    title: "Shipping APIs that feel invisible",
    creator: "Mira Chen",
    username: "mira",
    category: "Engineering",
    duration: "18:06",
    views: "948K",
    likes: "41K",
    subscribers: "426K",
    accent: "from-neutral-950 via-slate-800 to-blue-200",
    description:
      "JWT sessions, upload pipelines, deployment contracts, and user-first API ergonomics.",
  },
  {
    id: "linear-growth",
    title: "The Linear approach to product motion",
    creator: "Northstar Labs",
    username: "northstar",
    category: "Product",
    duration: "09:32",
    views: "1.1M",
    likes: "55K",
    subscribers: "1.2M",
    accent: "from-black via-zinc-900 to-violet-200",
    description:
      "Minimal interfaces, meaningful transitions, and why restraint often feels expensive.",
  },
  {
    id: "notion-systems",
    title: "Building knowledge systems for creators",
    creator: "Elena Park",
    username: "elena",
    category: "Startups",
    duration: "15:21",
    views: "732K",
    likes: "29K",
    subscribers: "338K",
    accent: "from-stone-950 via-neutral-800 to-amber-100",
    description:
      "Planning libraries, content calendars, and dashboards that scale without visual noise.",
  },
  {
    id: "cinematic-ui",
    title: "Cinematic UI without the drama",
    creator: "Frame Theory",
    username: "frame",
    category: "Cinema",
    duration: "11:16",
    views: "684K",
    likes: "22K",
    subscribers: "205K",
    accent: "from-black via-neutral-900 to-red-100",
    description:
      "How motion, scale, and contrast can make software feel memorable without becoming heavy.",
  },
  {
    id: "ai-workbench",
    title: "AI workbench patterns for modern teams",
    creator: "Signal Room",
    username: "signal",
    category: "AI",
    duration: "22:04",
    views: "1.8M",
    likes: "96K",
    subscribers: "980K",
    accent: "from-slate-950 via-zinc-900 to-cyan-100",
    description:
      "Agentic product patterns, review loops, and how premium AI tools stay predictable.",
  },
  {
    id: "portfolio-polish",
    title: "Portfolio products that recruiters remember",
    creator: "Hiring Signals",
    username: "hiring",
    category: "Design",
    duration: "08:44",
    views: "512K",
    likes: "18K",
    subscribers: "124K",
    accent: "from-zinc-950 via-neutral-800 to-emerald-100",
    description:
      "The exact difference between a tutorial app and a project that reads as job-ready.",
  },
  {
    id: "render-vercel",
    title: "Deploying split-stack apps cleanly",
    creator: "Cloudline",
    username: "cloudline",
    category: "Engineering",
    duration: "14:39",
    views: "389K",
    likes: "16K",
    subscribers: "218K",
    accent: "from-slate-950 via-neutral-900 to-sky-100",
    description:
      "Vercel frontend, Render backend, environment contracts, CORS, cookies, and API health checks.",
  },
  {
    id: "saaS-taste",
    title: "Why SaaS taste is mostly editing",
    creator: "Quiet Software",
    username: "quiet",
    category: "Product",
    duration: "10:05",
    views: "624K",
    likes: "27K",
    subscribers: "301K",
    accent: "from-black via-zinc-800 to-zinc-300",
    description:
      "Spacing, copy, contrast, and interaction decisions that make a screen feel intentional.",
  },
  {
    id: "creator-analytics",
    title: "Analytics that creators actually use",
    creator: "Metric House",
    username: "metric",
    category: "Startups",
    duration: "17:58",
    views: "806K",
    likes: "33K",
    subscribers: "457K",
    accent: "from-neutral-950 via-stone-800 to-lime-100",
    description:
      "Designing metrics cards, retention insight, and revenue clarity without dashboard fatigue.",
  },
];

export const recommendedVideos = videos.slice(1);

export const comments = [
  {
    id: "c1",
    author: "Priya K.",
    body: "This is exactly the level of polish that separates a real product from a classroom clone.",
    time: "2h ago",
  },
  {
    id: "c2",
    author: "Daniel Moss",
    body: "Loved the restraint in the interface. Premium without being noisy.",
    time: "5h ago",
  },
  {
    id: "c3",
    author: "Studio North",
    body: "The deployment section alone saved me a full debugging afternoon.",
    time: "1d ago",
  },
];

export const creatorStats = [
  { label: "Total views", value: "4.8M", trend: "+18.2%" },
  { label: "Subscribers", value: "128K", trend: "+9.4%" },
  { label: "Watch time", value: "92K hrs", trend: "+14.7%" },
  { label: "Engagement", value: "12.8%", trend: "+3.1%" },
];
