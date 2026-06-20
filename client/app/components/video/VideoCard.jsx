import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoCard({ featured = false, video }) {
  return (
    <Motion.article
      className="group"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <Link className="block" to={`/watch/${video.id}`}>
        <div className={`relative overflow-hidden rounded-[1.5rem] bg-apple-gray/20 ${featured ? "aspect-[21/9]" : "aspect-video"} transition-shadow duration-300 group-hover:shadow-2xl`}>
          {/* Base Thumbnail */}
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {/* Preview on Hover */}
          <img 
            src={video.previewUrl} 
            alt={`${video.title} preview`} 
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105" 
          />
          
          {/* Play Icon (fade in) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <Play className="ml-1 h-6 w-6 fill-white text-white" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
            {video.duration}
          </div>
        </div>

        <div className="mt-3 flex gap-3 px-1">
          <img src={video.avatarUrl} alt={video.creator} className="h-9 w-9 shrink-0 rounded-full object-cover" />
          <div className="flex flex-col overflow-hidden">
            <h3 className={`${featured ? "text-xl" : "text-base"} font-semibold leading-tight text-apple-black dark:text-white line-clamp-2`}>
              {video.title}
            </h3>
            <p className="mt-1 text-sm text-apple-gray hover:text-apple-black dark:hover:text-white transition-colors">{video.creator}</p>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-apple-gray">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.uploadTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </Motion.article>
  );
}
