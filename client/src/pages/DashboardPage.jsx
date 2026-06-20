import { useQuery } from "@tanstack/react-query";
import { BarChart3, Pencil, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import { FileInput, Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";
import { getDashboardData } from "../services/videoService";
import { useToast } from "../contexts/ToastContext";

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { showToast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  function handleUpload(event) {
    event.preventDefault();
    setUploadOpen(false);
    showToast("Frontend upload draft saved. Add video API routes to publish for real.");
  }

  return (
    <Page className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-apple-blue">Creator Dashboard</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-apple-black dark:text-white sm:text-7xl">
            Manage the studio.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-apple-gray">
            Analytics, uploads, video management, and creator workflow tools in a clean operating surface.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" /> Upload video
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-40" key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat) => (
              <article className="glass-panel rounded-[2rem] p-5" key={stat.label}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-apple-gray">{stat.label}</p>
                  <BarChart3 className="h-5 w-5 text-apple-blue" />
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-500">{stat.trend}</p>
              </article>
            ))}
          </div>

          <section className="mt-10 overflow-hidden rounded-[2rem] border border-apple-line/70 bg-white dark:border-white/10 dark:bg-white/[0.05]">
            <div className="border-b border-apple-line/70 p-5 dark:border-white/10">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-apple-black dark:text-white">Manage videos</h2>
            </div>
            <div className="divide-y divide-apple-line/70 dark:divide-white/10">
              {data.videos.map((video) => (
                <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center" key={video.id}>
                  <div>
                    <p className="font-semibold text-apple-black dark:text-white">{video.title}</p>
                    <p className="mt-1 text-sm text-apple-gray">{video.views} views · {video.category} · {video.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary"><Pencil className="h-4 w-4" /> Edit</Button>
                    <Button variant="ghost"><Trash2 className="h-4 w-4" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <Modal isOpen={uploadOpen} title="Upload video" onClose={() => setUploadOpen(false)}>
        <form className="grid gap-4" onSubmit={handleUpload}>
          <Input label="Title" name="title" placeholder="A polished backend architecture walkthrough" required />
          <Input label="Description" name="description" placeholder="Short description" required />
          <FileInput label="Video file" name="videoFile" required />
          <FileInput label="Thumbnail" name="thumbnail" required />
          <Button type="submit">
            <Upload className="h-4 w-4" /> Save draft
          </Button>
        </form>
      </Modal>
    </Page>
  );
}
