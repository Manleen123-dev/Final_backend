import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Clock3, Eye } from "lucide-react";

export default function VideoCard({ featured = false, video }) {
  return (
    <Motion.article
      className="group"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <Link className="block" to={`/watch/${video.id}`}>
        <div
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${video.accent} ${
            featured ? "min-h-[420px]" : "min-h-[260px]"
          } shadow-premium`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.32),transparent_16rem)] opacity-80" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-full bg-white/[0.15] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {video.category}
            </span>
            <span className="rounded-full bg-black/25 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {video.duration}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-sm font-medium text-white/70">{video.creator}</p>
            <h3 className={`${featured ? "text-4xl" : "text-2xl"} mt-2 max-w-xl font-semibold leading-tight tracking-tight`}>
              {video.title}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 px-1">
          <p className="line-clamp-2 text-sm leading-6 text-apple-gray">{video.description}</p>
          <div className="flex shrink-0 items-center gap-3 text-xs font-semibold text-apple-gray">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {video.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {video.duration}
            </span>
          </div>
        </div>
      </Link>
    </Motion.article>
  );
}
