import {
  categories,
  comments,
  creatorStats,
  recommendedVideos,
  videos,
} from "../data/mockVideos";

const wait = (ms = 240) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getVideos({ category = "All", page = 1, query = "" } = {}) {
  await wait();
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = videos.filter((video) => {
    const matchesCategory = category === "All" || video.category === category;
    const matchesQuery =
      !normalizedQuery ||
      [video.title, video.creator, video.description, video.category]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  const pageSize = 8;
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    nextPage: start + pageSize < filtered.length ? page + 1 : null,
    total: filtered.length,
  };
}

export async function getVideo(videoId) {
  await wait();
  const video = videos.find((item) => item.id === videoId) || videos[0];
  return {
    video,
    comments,
    recommended: recommendedVideos.filter((item) => item.id !== video.id).slice(0, 5),
  };
}

export async function getDashboardData() {
  await wait();
  return {
    stats: creatorStats,
    videos: videos.slice(0, 6),
  };
}

export async function getCategories() {
  await wait(120);
  return categories;
}
