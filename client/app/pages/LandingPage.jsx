import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import VideoCard from "../components/video/VideoCard";
import Page from "../components/layout/Page";
import { categories, videos } from "../data/mockVideos";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const featured = videos[0];
  const trending = videos.slice(1, 4);

  return (
    <Page>
      <section className="relative overflow-hidden bg-hero-light dark:bg-hero-dark">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-28 lg:pt-24">
          <Motion.div
            animate="show"
            className="grid content-center"
            initial="hidden"
            transition={{ staggerChildren: 0.08 }}
          >
            <Motion.div variants={fadeUp} className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-apple-line/70 bg-white/70 px-4 py-2 text-sm font-medium text-apple-gray backdrop-blur dark:border-white/10 dark:bg-white/[0.08] dark:text-white/70">
              <Sparkles className="h-4 w-4 text-apple-blue" />
              Premium video platform for creators
            </Motion.div>
            <Motion.h1 variants={fadeUp} className="max-w-4xl text-6xl font-semibold leading-[0.92] tracking-[-0.05em] text-apple-black dark:text-white sm:text-7xl lg:text-8xl">
              VideoTube, but calm, fast, and beautifully composed.
            </Motion.h1>
            <Motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-8 text-apple-gray">
              A world-class frontend inspired by Apple, Linear, and Notion:
              refined motion, focused content, elegant dark mode, and a full creator workflow.
            </Motion.p>
            <Motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="premium-link px-7" to="/feed">
                Explore videos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="premium-link-secondary" to="/register">
                Start creating <Play className="h-4 w-4" />
              </Link>
            </Motion.div>
          </Motion.div>

          <Motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative"
            initial={{ opacity: 0, scale: 0.96, y: 26 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-white/70 to-transparent blur-2xl dark:from-white/10" />
            <div className="relative rounded-[2.5rem] border border-white/80 bg-white/55 p-3 shadow-premium backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06]">
              <VideoCard featured video={featured} />
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Featured"
          title="A curated surface for serious creators."
          description="The interface avoids noisy clone patterns and uses editorial cards, graceful hierarchy, and subtle motion."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {trending.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section className="border-y border-apple-line/70 bg-white/60 py-20 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Categories"
            title="Focused channels, not clutter."
            description="Design, engineering, product, AI, startups, and cinematic software thinking."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                className="rounded-full border border-apple-line/70 bg-white px-5 py-3 text-sm font-semibold text-apple-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium dark:border-white/10 dark:bg-white/[0.08] dark:text-white"
                key={category}
                to={`/feed?category=${category}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            "Persistent light and dark mode",
            "JWT-ready frontend architecture",
            "Responsive premium creator dashboard",
          ].map((item) => (
            <div className="glass-panel rounded-[2rem] p-6" key={item}>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-apple-black dark:text-white">
                {item}
              </h3>
              <p className="mt-3 text-sm leading-6 text-apple-gray">
                Built with reusable components, Context API, Axios, React Query, and Framer Motion.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-apple-black p-8 text-center text-white shadow-premium dark:bg-white dark:text-apple-black sm:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-60">Ready for deployment</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Vercel frontend. Render backend. One polished product story.
          </h2>
          <div className="mt-8 flex justify-center">
            <Link className="premium-link-secondary" to="/dashboard">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}

function SectionTitle({ description, eyebrow, title }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-apple-blue">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white sm:text-6xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-apple-gray">{description}</p>
    </div>
  );
}
