import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import VideoCard from "../components/video/VideoCard";
import { getCategories, getVideos } from "../services/videoService";

export default function HomeFeedPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const search = params.get("search") || "";

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const videosQuery = useInfiniteQuery({
    queryKey: ["videos", category, search],
    queryFn: ({ pageParam }) => getVideos({ category, page: pageParam, query: search }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const videos = videosQuery.data?.pages.flatMap((page) => page.items) || [];

  function handleSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query");
    setParams({ category, search: query || "" });
  }

  return (
    <Page className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-apple-blue">Home Feed</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-apple-black dark:text-white sm:text-7xl">
            Discover refined creator work.
          </h1>
        </div>
        <form className="flex w-full max-w-md items-center gap-3 rounded-full border border-apple-line/70 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/[0.08]" onSubmit={handleSearch}>
          <Search className="h-4 w-4 text-apple-gray" />
          <input
            className="h-9 w-full bg-transparent text-sm text-apple-black outline-none placeholder:text-apple-gray dark:text-white"
            defaultValue={search}
            name="query"
            placeholder="Search premium videos"
          />
        </form>
      </div>

      <div className="mt-10 flex gap-3 overflow-x-auto pb-3">
        {(categoriesQuery.data || ["All"]).map((item) => (
          <button
            className={`shrink-0 rounded-full border px-5 py-3 text-sm font-semibold transition ${
              item === category
                ? "border-apple-black bg-apple-black text-white dark:border-white dark:bg-white dark:text-apple-black"
                : "border-apple-line/70 bg-white/70 text-apple-gray hover:text-apple-black dark:border-white/10 dark:bg-white/[0.08] dark:hover:text-white"
            }`}
            key={item}
            type="button"
            onClick={() => setParams({ category: item, search })}
          >
            {item}
          </button>
        ))}
      </div>

      {videosQuery.isLoading ? (
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-80" key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            {videosQuery.hasNextPage ? (
              <Button isLoading={videosQuery.isFetchingNextPage} variant="secondary" onClick={() => videosQuery.fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <p className="text-sm text-apple-gray">You are all caught up.</p>
            )}
          </div>
        </>
      )}
    </Page>
  );
}
