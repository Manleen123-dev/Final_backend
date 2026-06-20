import {
  BarChart3,
  Clapperboard,
  Cloud,
  Database,
  Eye,
  Heart,
  History,
  LayoutDashboard,
  ListVideo,
  MessageSquareText,
  Rocket,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

export const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "account", label: "Account", icon: Settings },
  { id: "channel", label: "Channel", icon: UsersRound },
  { id: "media", label: "Media Studio", icon: Clapperboard },
  { id: "history", label: "History", icon: History },
];

export const modelCards = [
  {
    title: "Videos",
    description: "Upload flows, thumbnails, visibility, views, duration, ownership.",
    icon: Clapperboard,
    status: "Model ready",
  },
  {
    title: "Tweets",
    description: "Creator posts for lightweight community updates.",
    icon: MessageSquareText,
    status: "Model ready",
  },
  {
    title: "Playlists",
    description: "Curated collections owned by creators.",
    icon: ListVideo,
    status: "Model ready",
  },
  {
    title: "Subscriptions",
    description: "Follower graph powering channel analytics and profile state.",
    icon: UsersRound,
    status: "Model ready",
  },
  {
    title: "Likes",
    description: "Unified likes across videos, comments, and tweets.",
    icon: Heart,
    status: "Model ready",
  },
  {
    title: "Comments",
    description: "Conversation layer for video engagement.",
    icon: MessageSquareText,
    status: "Model ready",
  },
];

export const endpointCards = [
  {
    method: "POST",
    path: "/api/v1/users/register",
    title: "Creator onboarding",
    detail: "Multipart signup with avatar and optional channel cover image.",
  },
  {
    method: "POST",
    path: "/api/v1/users/login",
    title: "JWT login",
    detail: "Secure cookie support plus token fallback for deployed clients.",
  },
  {
    method: "PATCH",
    path: "/api/v1/users/update-account",
    title: "Account settings",
    detail: "Update profile identity without touching password data.",
  },
  {
    method: "GET",
    path: "/api/v1/users/history",
    title: "Watch history",
    detail: "Aggregates viewed videos and owner metadata.",
  },
];

export const deploymentCards = [
  {
    title: "Vercel frontend",
    detail: "Deploy the client directory and set VITE_API_BASE_URL to your Render API URL.",
    icon: Rocket,
  },
  {
    title: "Render backend",
    detail: "Use npm start and configure MongoDB, JWT, Cloudinary, and CORS env values.",
    icon: Cloud,
  },
  {
    title: "MongoDB Atlas",
    detail: "The API keeps Atlas as the source of truth for users and creator content.",
    icon: Database,
  },
  {
    title: "Auth posture",
    detail: "Bearer token fallback keeps cross-origin deployment practical.",
    icon: ShieldCheck,
  },
];

export const contentPipeline = [
  {
    title: "API architecture walkthrough",
    format: "Video",
    status: "Published",
    metric: "18.4k views",
    icon: Eye,
  },
  {
    title: "MongoDB modeling notes",
    format: "Tweet",
    status: "Draft",
    metric: "Ready to post",
    icon: MessageSquareText,
  },
  {
    title: "Backend mastery playlist",
    format: "Playlist",
    status: "Curated",
    metric: "9 videos",
    icon: ListVideo,
  },
  {
    title: "Subscriber growth board",
    format: "Channel",
    status: "Live",
    metric: "Tracking",
    icon: BarChart3,
  },
];

export const defaultDraft = {
  title: "Ship a production-ready video API",
  description:
    "A polished creator episode covering auth, uploads, MongoDB aggregation, deployment, and frontend integration.",
  type: "Video",
  visibility: "Public",
};

export const accountHighlights = [
  {
    label: "Frontend",
    value: "React + Tailwind",
    detail: "Componentized, deployable, and easier to scale.",
  },
  {
    label: "Backend",
    value: "Express API",
    detail: "Render-ready with credentialed CORS.",
  },
  {
    label: "Auth",
    value: "JWT",
    detail: "Cookies plus Authorization headers.",
  },
  {
    label: "Domain",
    value: "Creator platform",
    detail: "Videos, channels, playlists, posts, comments, likes.",
  },
];

export const userFallback = {
  fullName: "Creator",
  username: "creator",
  email: "creator@example.com",
};

export const statIcons = {
  dashboard: LayoutDashboard,
  user: UserRound,
  shield: ShieldCheck,
  chart: BarChart3,
};
