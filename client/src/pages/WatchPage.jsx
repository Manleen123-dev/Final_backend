import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Play, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import VideoCard from "../components/video/VideoCard";
import { getVideo } from "../services/videoService";

export default function WatchPage() {
  const { videoId } = useParams();
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(videoId),
  });

  if (isLoading) {
    return (
      <Page className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-[520px]" />
        <Skeleton className="h-40" />
      </Page>
    );
  }

  const { comments, recommended, video, creatorVideos } = data;

  return (
    <Page className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <section className="min-w-0">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-apple-gray/20 aspect-video shadow-premium group">
          <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />
          <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white shadow-premium backdrop-blur transition hover:scale-105 hover:bg-white/30" type="button">
            <Play className="ml-1 h-8 w-8 fill-white" />
          </button>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-apple-black dark:text-white sm:text-3xl">
            {video.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={video.avatarUrl} alt={video.creator} className="h-11 w-11 rounded-full object-cover shadow-sm" />
              <div>
                <h3 className="font-semibold text-apple-black dark:text-white text-base leading-tight">
                  {video.creator}
                </h3>
                <p className="text-sm text-apple-gray mt-0.5">
                  {video.subscribers} subscribers
                </p>
              </div>
              <Button 
                variant={subscribed ? "secondary" : "primary"} 
                className="ml-4 rounded-full px-5"
                onClick={() => setSubscribed((current) => !current)}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant={liked ? "primary" : "secondary"} className="rounded-full px-5" onClick={() => setLiked((current) => !current)}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>
          
          <div className="mt-6 rounded-2xl bg-white/70 p-4 border border-apple-line/70 dark:bg-white/[0.05] dark:border-white/10">
             <div className="flex flex-wrap gap-3 text-sm font-semibold text-apple-black dark:text-white">
                <span>{video.views} views</span>
                <span>{video.uploadTime}</span>
             </div>
             <p className="mt-2 text-sm leading-6 text-apple-black/80 dark:text-white/80">{video.description}</p>
          </div>
        </div>

        {creatorVideos && creatorVideos.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-apple-black dark:text-white mb-4">More from {video.creator}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
              {creatorVideos.map((item) => (
                <div key={item.id} className="w-[300px] shrink-0 snap-start">
                   <VideoCard video={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-[2rem] border border-apple-line/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.05]">
          <div className="mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-apple-blue" />
            <h2 className="text-xl font-semibold text-apple-black dark:text-white">Comments</h2>
          </div>
          <div className="mb-8 flex gap-4">
             <div className="h-10 w-10 shrink-0 rounded-full bg-apple-blue text-white flex items-center justify-center font-semibold">
               U
             </div>
             <div className="flex-1 flex flex-col gap-2 relative">
               <input className="h-10 w-full rounded-full border border-apple-line/70 bg-white px-4 text-sm outline-none focus:border-apple-blue dark:border-white/10 dark:bg-white/[0.08] dark:text-white" placeholder="Add a thoughtful comment" />
             </div>
          </div>
          <div className="grid gap-6">
            {comments.map((comment) => (
              <article className="flex gap-4" key={comment.id}>
                <img src={comment.avatarUrl} alt={comment.author} className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-apple-black dark:text-white">{comment.author}</p>
                    <span className="text-xs text-apple-gray">{comment.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-apple-black/80 dark:text-white/80">{comment.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <aside className="grid content-start gap-5">
        <h2 className="text-xl font-semibold text-apple-black dark:text-white">Recommended</h2>
        <div className="grid gap-5">
          {recommended.map((item) => (
            <VideoCard key={item.id} video={item} />
          ))}
        </div>
      </aside>
    </Page>
  );
}
