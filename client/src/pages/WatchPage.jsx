import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Play, Plus, Send } from "lucide-react";
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

  const { comments, recommended, video } = data;

  return (
    <Page className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <section className="min-w-0">
        <div className={`relative grid aspect-video place-items-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${video.accent} shadow-premium`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.32),transparent_20rem)]" />
          <button className="relative grid h-20 w-20 place-items-center rounded-full bg-white/20 text-white shadow-premium backdrop-blur transition hover:scale-105" type="button">
            <Play className="ml-1 h-8 w-8 fill-white" />
          </button>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-apple-blue">{video.category}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white sm:text-5xl">
                {video.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-apple-gray">{video.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant={liked ? "primary" : "secondary"} onClick={() => setLiked((current) => !current)}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button variant={subscribed ? "secondary" : "primary"} onClick={() => setSubscribed((current) => !current)}>
                <Plus className="h-4 w-4" />
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-apple-gray">
            <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/[0.08]">{video.views} views</span>
            <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/[0.08]">{video.likes} likes</span>
            <span className="rounded-full bg-white/70 px-4 py-2 dark:bg-white/[0.08]">{video.subscribers} subscribers</span>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-apple-line/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.05]">
          <div className="mb-5 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-apple-blue" />
            <h2 className="text-xl font-semibold text-apple-black dark:text-white">Comments</h2>
          </div>
          <div className="mb-6 flex gap-3">
            <input className="h-12 flex-1 rounded-full border border-apple-line/70 bg-white px-4 text-sm outline-none focus:border-apple-blue dark:border-white/10 dark:bg-white/[0.08] dark:text-white" placeholder="Add a thoughtful comment" />
            <Button><Send className="h-4 w-4" /></Button>
          </div>
          <div className="grid gap-4">
            {comments.map((comment) => (
              <article className="rounded-2xl bg-white p-4 dark:bg-white/[0.06]" key={comment.id}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-apple-black dark:text-white">{comment.author}</p>
                  <span className="text-xs text-apple-gray">{comment.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-apple-gray">{comment.body}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <aside className="grid content-start gap-5">
        <h2 className="text-xl font-semibold text-apple-black dark:text-white">Recommended</h2>
        {recommended.map((item) => (
          <VideoCard key={item.id} video={item} />
        ))}
      </aside>
    </Page>
  );
}
