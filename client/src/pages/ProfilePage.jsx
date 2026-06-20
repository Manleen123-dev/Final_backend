import { useState } from "react";
import { Camera, Save, Upload } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import { FileInput, Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import VideoCard from "../components/video/VideoCard";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authApi } from "../services/apiClient";
import { videos } from "../data/mockVideos";

export default function ProfilePage() {
  const { setUser, user } = useAuth();
  const { showToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState("");

  async function updateProfile(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading("profile");
    try {
      const response = await authApi.updateAccount({
        fullName: form.get("fullName"),
        email: form.get("email"),
      });
      setUser(response.data);
      setEditOpen(false);
      showToast(response.message || "Profile updated.");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading("");
    }
  }

  async function uploadImage(event, type) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(type);
    try {
      const response = type === "avatar" ? await authApi.updateAvatar(form) : await authApi.updateCover(form);
      setUser(response.data);
      showToast(response.message || "Image updated.");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading("");
    }
  }

  return (
    <Page className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2.5rem] border border-apple-line/70 bg-white shadow-premium dark:border-white/10 dark:bg-white/[0.05]">
        <div
          className="h-72 bg-gradient-to-br from-black via-zinc-900 to-zinc-300"
          style={{
            backgroundImage: user?.coverImage
              ? `linear-gradient(135deg, rgba(0,0,0,.05), rgba(0,0,0,.48)), url(${user.coverImage})`
              : undefined,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="-mt-20 grid h-32 w-32 place-items-center overflow-hidden rounded-[2rem] border-4 border-white bg-apple-black text-3xl font-semibold text-white dark:border-apple-black dark:bg-white dark:text-apple-black">
              {user?.avatar ? <img alt={user.fullName} className="h-full w-full object-cover" src={user.avatar} /> : user?.fullName?.[0]}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white">{user?.fullName}</h1>
              <p className="mt-1 text-apple-gray">@{user?.username}</p>
              <p className="mt-1 text-apple-gray">{user?.email}</p>
            </div>
          </div>
          <Button onClick={() => setEditOpen(true)}>Edit profile</Button>
        </div>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <form className="glass-panel grid gap-4 rounded-[2rem] p-5" onSubmit={(event) => uploadImage(event, "avatar")}>
          <h2 className="text-xl font-semibold text-apple-black dark:text-white">Avatar</h2>
          <FileInput accept="image/*" label="Upload avatar" name="avatar" required />
          <Button isLoading={loading === "avatar"} type="submit" variant="secondary">
            <Camera className="h-4 w-4" /> Update avatar
          </Button>
        </form>
        <form className="glass-panel grid gap-4 rounded-[2rem] p-5" onSubmit={(event) => uploadImage(event, "cover")}>
          <h2 className="text-xl font-semibold text-apple-black dark:text-white">Cover</h2>
          <FileInput accept="image/*" label="Upload cover" name="coverImage" required />
          <Button isLoading={loading === "cover"} type="submit" variant="secondary">
            <Upload className="h-4 w-4" /> Update cover
          </Button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-apple-black dark:text-white">Uploaded videos</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <Modal isOpen={editOpen} title="Edit profile" onClose={() => setEditOpen(false)}>
        <form className="grid gap-4" onSubmit={updateProfile}>
          <Input defaultValue={user?.fullName} label="Full name" name="fullName" required />
          <Input defaultValue={user?.email} label="Email" name="email" type="email" required />
          <Button isLoading={loading === "profile"} type="submit">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </form>
      </Modal>
    </Page>
  );
}
