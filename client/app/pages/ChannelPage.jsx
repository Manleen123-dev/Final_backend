import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import VideoCard from "../components/video/VideoCard";
import { videos } from "../data/mockVideos";
import { authApi } from "../services/apiClient";

async function getChannel(username) {
  try {
    return (await authApi.channel(username)).data;
  } catch {
    const owner = videos.find((video) => video.username === username) || videos[0];
    return {
      avatar: "",
      coverImage: "",
      fullName: owner.creator,
      username: owner.username,
      subscribersCount: owner.subscribers,
      channelsSubscribedToCount: "42",
    };
  }
}

export default function ChannelPage() {
  const { username } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const { data: channel } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => getChannel(username),
  });
  const channelVideos = videos.filter((video) => video.username === username).concat(videos.slice(0, 2));

  return (
    <Page className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2.5rem] border border-apple-line/70 bg-white shadow-premium dark:border-white/10 dark:bg-white/[0.05]">
        <div className="h-80 bg-gradient-to-br from-black via-zinc-900 to-zinc-300" />
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="-mt-20 grid h-32 w-32 place-items-center overflow-hidden rounded-[2rem] border-4 border-white bg-apple-black text-3xl font-semibold text-white dark:border-apple-black dark:bg-white dark:text-apple-black">
              {channel?.avatar ? <img alt={channel.fullName} src={channel.avatar} /> : channel?.fullName?.[0]}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white">{channel?.fullName || username}</h1>
              <p className="mt-1 text-apple-gray">@{channel?.username || username}</p>
              <p className="mt-1 text-apple-gray">{channel?.subscribersCount || 0} subscribers</p>
            </div>
          </div>
          <Button variant={subscribed ? "secondary" : "primary"} onClick={() => setSubscribed((current) => !current)}>
            <UserPlus className="h-4 w-4" />
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-apple-black dark:text-white">Channel videos</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {channelVideos.map((video) => (
            <VideoCard key={`${video.id}-${username}`} video={video} />
          ))}
        </div>
      </section>
    </Page>
  );
}
