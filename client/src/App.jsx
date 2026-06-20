import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Compass,
  Eye,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Menu,
  Play,
  Rocket,
  Search,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { api, sessionStore } from "./lib/api";
import {
  accountHighlights,
  contentPipeline,
  defaultDraft,
  deploymentCards,
  endpointCards,
  modelCards,
  navigation,
  statIcons,
  userFallback,
} from "./data/studioData";

const appName = "CreatorHub Studio";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function initialsFor(user) {
  const source = user?.fullName || user?.username || "CreatorHub";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normaliseUser(user) {
  return { ...userFallback, ...(user || {}) };
}

export default function App() {
  const [activeView, setActiveView] = useState("overview");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState("");
  const [toast, setToast] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [channel, setChannel] = useState(null);
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState(defaultDraft);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = useMemo(() => normaliseUser(user), [user]);

  function notify(message, type = "success") {
    setToast({ message, type, id: Date.now() });
  }

  async function runWithLoading(key, task) {
    try {
      setLoading(key);
      await task();
    } catch (error) {
      notify(error.message || "Something went wrong", "error");
    } finally {
      setLoading("");
    }
  }

  useEffect(() => {
    const timer = toast ? window.setTimeout(() => setToast(null), 4200) : null;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    async function bootstrap() {
      try {
        const health = await api.health();
        setApiStatus(health?.success ? "online" : "degraded");
      } catch {
        setApiStatus("offline");
      }

      if (!sessionStore.getToken()) {
        setBooting(false);
        return;
      }

      try {
        const payload = await api.currentUser();
        setUser(payload.data);
      } catch {
        sessionStore.setToken("");
      } finally {
        setBooting(false);
      }
    }

    bootstrap();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("identity") || "").trim();
    const password = String(form.get("password") || "");
    const body = identity.includes("@")
      ? { email: identity, password }
      : { username: identity, password };

    await runWithLoading("login", async () => {
      const payload = await api.login(body);
      sessionStore.setToken(payload.data?.accessToken);
      setUser(payload.data?.user);
      setActiveView("overview");
      notify(payload.message || "Welcome back to the studio.");
    });
  }

  async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await runWithLoading("register", async () => {
      const payload = await api.register(formData);
      setAuthMode("login");
      notify(payload.message || "Creator account created. You can log in now.");
    });
  }

  async function handleLogout() {
    await runWithLoading("logout", async () => {
      try {
        await api.logout();
      } finally {
        sessionStore.setToken("");
        setUser(null);
        setChannel(null);
        setHistory([]);
        setActiveView("overview");
        notify("You are logged out.");
      }
    });
  }

  async function refreshUser() {
    await runWithLoading("refresh", async () => {
      const payload = await api.currentUser();
      setUser(payload.data);
      notify(payload.message || "Session refreshed.");
    });
  }

  async function updateAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    await runWithLoading("account", async () => {
      const payload = await api.updateAccount({
        fullName: String(form.get("fullName") || "").trim(),
        email: String(form.get("email") || "").trim(),
      });
      setUser(payload.data);
      notify(payload.message || "Account updated.");
    });
  }

  async function changePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    await runWithLoading("password", async () => {
      const payload = await api.changePassword({
        oldPassword: String(form.get("oldPassword") || ""),
        newPassword: String(form.get("newPassword") || ""),
      });
      event.currentTarget.reset();
      notify(payload.message || "Password changed.");
    });
  }

  async function updateAvatar(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await runWithLoading("avatar", async () => {
      const payload = await api.updateAvatar(formData);
      setUser(payload.data);
      notify(payload.message || "Avatar updated.");
    });
  }

  async function updateCover(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await runWithLoading("cover", async () => {
      const payload = await api.updateCover(formData);
      setUser(payload.data);
      notify(payload.message || "Cover image updated.");
    });
  }

  async function lookupChannel(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") || "").trim();

    await runWithLoading("channel", async () => {
      const payload = await api.channel(username);
      setChannel(payload.data);
      notify(payload.message || "Channel loaded.");
    });
  }

  async function loadHistory() {
    await runWithLoading("history", async () => {
      const payload = await api.history();
      setHistory(Array.isArray(payload.data) ? payload.data : []);
      notify(payload.message || "Watch history loaded.");
    });
  }

  function saveDraft(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setDraft({
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      type: String(form.get("type") || "Video"),
      visibility: String(form.get("visibility") || "Public"),
    });
    notify("Frontend draft saved.");
  }

  if (booting) {
    return <BootScreen />;
  }

  if (!user) {
    return (
      <>
        <AuthView
          apiStatus={apiStatus}
          authMode={authMode}
          loading={loading}
          onLogin={handleLogin}
          onRegister={handleRegister}
          setAuthMode={setAuthMode}
        />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <>
      <StudioShell
        activeView={activeView}
        apiStatus={apiStatus}
        currentUser={currentUser}
        loading={loading}
        sidebarOpen={sidebarOpen}
        setActiveView={setActiveView}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        onRefresh={refreshUser}
      >
        {activeView === "overview" && (
          <OverviewView
            apiStatus={apiStatus}
            currentUser={currentUser}
            setActiveView={setActiveView}
          />
        )}
        {activeView === "account" && (
          <AccountView
            currentUser={currentUser}
            loading={loading}
            onAvatar={updateAvatar}
            onCover={updateCover}
            onPassword={changePassword}
            onUpdateAccount={updateAccount}
          />
        )}
        {activeView === "channel" && (
          <ChannelView
            channel={channel}
            currentUser={currentUser}
            loading={loading}
            onLookup={lookupChannel}
          />
        )}
        {activeView === "media" && (
          <MediaStudioView draft={draft} loading={loading} onSaveDraft={saveDraft} />
        )}
        {activeView === "history" && (
          <HistoryView history={history} loading={loading} onLoad={loadHistory} />
        )}
      </StudioShell>
      <Toast toast={toast} />
    </>
  );
}

function BootScreen() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="studio-card grid w-full max-w-md place-items-center gap-5 p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-studio-ink text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Preparing studio</h1>
          <p className="mt-2 text-sm leading-6 text-studio-muted">
            Checking the API service and restoring your creator session.
          </p>
        </div>
      </div>
    </main>
  );
}

function AuthView({ apiStatus, authMode, loading, onLogin, onRegister, setAuthMode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(360px,500px)_1fr]">
      <section className="flex min-h-screen flex-col justify-between border-r border-studio-line bg-white p-5 sm:p-8">
        <Brand />

        <div className="my-10 grid gap-8">
          <div>
            <StatusBadge status={apiStatus} />
            <h1 className="mt-5 max-w-sm text-5xl font-black leading-[0.95] tracking-tight text-studio-ink sm:text-6xl">
              Creator operations, fully polished.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-studio-muted">
              A React and Tailwind frontend for your Express backend, built as a
              resume-grade creator platform dashboard instead of a basic static page.
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-lg bg-studio-canvas p-1">
            <button
              className={cx(
                "rounded-md px-4 py-3 text-sm font-bold transition",
                authMode === "login"
                  ? "bg-white text-studio-ink shadow-sm"
                  : "text-studio-muted hover:text-studio-ink",
              )}
              type="button"
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className={cx(
                "rounded-md px-4 py-3 text-sm font-bold transition",
                authMode === "register"
                  ? "bg-white text-studio-ink shadow-sm"
                  : "text-studio-muted hover:text-studio-ink",
              )}
              type="button"
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          {authMode === "login" ? (
            <LoginForm loading={loading === "login"} onSubmit={onLogin} />
          ) : (
            <RegisterForm loading={loading === "register"} onSubmit={onRegister} />
          )}
        </div>

        <p className="text-sm leading-6 text-studio-muted">
          Local dev uses the Vite proxy. Deployment uses{" "}
          <code className="rounded bg-studio-canvas px-1.5 py-1">VITE_API_BASE_URL</code>{" "}
          for your Render API.
        </p>
      </section>

      <section className="hidden min-h-screen p-6 lg:block">
        <div className="grid min-h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-studio-line bg-white shadow-studio">
          <div className="flex items-center justify-between border-b border-studio-line p-4">
            <div className="flex w-full max-w-lg items-center gap-3 rounded-full bg-studio-canvas px-4 py-3 text-sm text-studio-muted">
              <Search className="h-4 w-4" />
              Search videos, creators, playlists, analytics
            </div>
            <div className="flex items-center gap-2 rounded-full bg-studio-greenSoft px-3 py-2 text-xs font-bold text-studio-greenDark">
              <CheckCircle2 className="h-4 w-4" />
              Resume-ready UI
            </div>
          </div>

          <div className="grid grid-cols-[1.2fr_0.8fr] gap-5 p-5">
            <div className="relative grid min-h-[580px] content-end overflow-hidden rounded-lg bg-studio-ink p-7 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.28),transparent_28rem),linear-gradient(135deg,#176b52,#111411_62%,#dfe8df)] opacity-90" />
              <div className="relative max-w-xl">
                <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-bold">
                  Video platform command center
                </span>
                <h2 className="mt-5 text-6xl font-black leading-none tracking-tight">
                  Publish, profile, analyze, repeat.
                </h2>
                <p className="mt-5 text-base leading-7 text-white/75">
                  The interface is designed around your actual backend domain:
                  users, channels, videos, tweets, playlists, subscriptions, likes,
                  comments, and watch history.
                </p>
              </div>
            </div>

            <div className="grid content-start gap-4">
              {deploymentCards.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginForm({ loading, onSubmit }) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <Field label="Email or username" name="identity" autoComplete="username" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <button className="studio-button-primary" disabled={loading} type="submit">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
        Login to studio
      </button>
    </form>
  );
}

function RegisterForm({ loading, onSubmit }) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" autoComplete="name" required />
        <Field label="Username" name="username" autoComplete="username" required />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />
      <FileField label="Avatar image" name="avatar" required />
      <FileField label="Cover image" name="coverImage" />
      <button className="studio-button-primary" disabled={loading} type="submit">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
        Create creator profile
      </button>
    </form>
  );
}

function StudioShell({
  activeView,
  apiStatus,
  children,
  currentUser,
  loading,
  onLogout,
  onRefresh,
  setActiveView,
  setSidebarOpen,
  sidebarOpen,
}) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-studio-line bg-white p-5 transition lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            className="rounded-lg p-2 text-studio-muted hover:bg-studio-canvas lg:hidden"
            type="button"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 grid gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition",
                  active
                    ? "bg-studio-ink text-white"
                    : "text-studio-muted hover:bg-studio-canvas hover:text-studio-ink",
                )}
                type="button"
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-4">
          <div className="rounded-lg bg-studio-canvas p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-studio-muted">
              API base
            </p>
            <p className="mt-2 break-all text-sm font-bold text-studio-ink">
              {api.baseUrl || "Vite proxy / same origin"}
            </p>
            <div className="mt-3">
              <StatusBadge status={apiStatus} compact />
            </div>
          </div>
          <button className="studio-button-ghost" disabled={loading === "refresh"} onClick={onRefresh} type="button">
            {loading === "refresh" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
            Refresh session
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-studio-ink/40 lg:hidden"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-studio-line bg-studio-canvas/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            className="rounded-lg border border-studio-line bg-white p-2 lg:hidden"
            type="button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 py-3 text-sm text-studio-muted shadow-sm sm:flex">
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate">Search workspace actions, creator content, routes</span>
          </div>
          <button className="rounded-lg border border-studio-line bg-white p-3">
            <Bell className="h-5 w-5 text-studio-muted" />
          </button>
          <UserAvatar user={currentUser} />
          <div className="hidden sm:block">
            <p className="text-sm font-black text-studio-ink">{currentUser.fullName}</p>
            <p className="text-xs text-studio-muted">@{currentUser.username}</p>
          </div>
          <button className="studio-button-ghost" disabled={loading === "logout"} onClick={onLogout} type="button">
            {loading === "logout" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        {children}
      </section>
    </main>
  );
}

function OverviewView({ apiStatus, currentUser, setActiveView }) {
  return (
    <ViewFrame
      eyebrow="Studio overview"
      title={`Welcome back, ${currentUser.fullName}.`}
      description="A professional creator-platform dashboard connected to your Express API and ready for separate frontend/backend deployment."
      action={
        <button className="studio-button-primary" onClick={() => setActiveView("media")} type="button">
          <Play className="h-4 w-4" />
          Open media studio
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={statIcons.dashboard}
          label="Frontend stack"
          value="React"
          detail="Vite, Tailwind, componentized UI."
        />
        <StatCard
          icon={statIcons.shield}
          label="API health"
          value={apiStatus}
          detail="Health route and JSON error handling."
        />
        <StatCard
          icon={statIcons.user}
          label="Session"
          value="JWT"
          detail="Cookie credentials plus token fallback."
        />
        <StatCard
          icon={statIcons.chart}
          label="Domain models"
          value="7"
          detail="Users, videos, tweets, playlists, subscriptions, likes, comments."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="studio-card p-5">
          <SectionHeader
            kicker="Creator pipeline"
            title="Content operations"
            action={<Badge>Frontend ready</Badge>}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {contentPipeline.map((item) => (
              <ContentCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <ProfilePreview user={currentUser} />
          <div className="studio-card p-5">
            <SectionHeader kicker="Deployment" title="Production path" />
            <div className="mt-4 grid gap-3">
              {deploymentCards.map((card) => (
                <FeatureCard key={card.title} {...card} compact />
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="studio-card p-5">
        <SectionHeader kicker="API contract" title="Connected user endpoints" />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {endpointCards.map((endpoint) => (
            <EndpointCard key={endpoint.path} endpoint={endpoint} />
          ))}
        </div>
      </section>
    </ViewFrame>
  );
}

function AccountView({ currentUser, loading, onAvatar, onCover, onPassword, onUpdateAccount }) {
  return (
    <ViewFrame
      eyebrow="Account settings"
      title="Creator identity and access."
      description="Update the profile, security, avatar, and channel cover routes from one polished settings surface."
    >
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-5">
          <ProfilePreview user={currentUser} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {accountHighlights.map((item) => (
              <div className="studio-card p-5" key={item.label}>
                <p className="text-xs font-bold uppercase tracking-wide text-studio-muted">
                  {item.label}
                </p>
                <p className="mt-2 text-xl font-black text-studio-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-studio-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <form className="studio-card grid gap-4 p-5" onSubmit={onUpdateAccount}>
            <SectionHeader kicker="Profile" title="Public account details" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field defaultValue={currentUser.fullName} label="Full name" name="fullName" required />
              <Field defaultValue={currentUser.email} label="Email" name="email" type="email" required />
            </div>
            <button className="studio-button-primary w-fit" disabled={loading === "account"} type="submit">
              {loading === "account" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Save profile
            </button>
          </form>

          <div className="grid gap-5 lg:grid-cols-2">
            <form className="studio-card grid gap-4 p-5" onSubmit={onPassword}>
              <SectionHeader kicker="Security" title="Password" />
              <Field label="Current password" name="oldPassword" type="password" required />
              <Field label="New password" name="newPassword" type="password" required />
              <button className="studio-button-secondary" disabled={loading === "password"} type="submit">
                {loading === "password" ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                Change password
              </button>
            </form>

            <div className="grid gap-5">
              <form className="studio-card grid gap-4 p-5" onSubmit={onAvatar}>
                <SectionHeader kicker="Media" title="Avatar upload" />
                <FileField label="Avatar image" name="avatar" required />
                <button className="studio-button-secondary" disabled={loading === "avatar"} type="submit">
                  {loading === "avatar" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  Update avatar
                </button>
              </form>

              <form className="studio-card grid gap-4 p-5" onSubmit={onCover}>
                <SectionHeader kicker="Media" title="Cover upload" />
                <FileField label="Cover image" name="coverImage" required />
                <button className="studio-button-secondary" disabled={loading === "cover"} type="submit">
                  {loading === "cover" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Update cover
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ViewFrame>
  );
}

function ChannelView({ channel, currentUser, loading, onLookup }) {
  const channelUser = channel ? normaliseUser(channel) : null;

  return (
    <ViewFrame
      eyebrow="Channel intelligence"
      title="Look up creator profiles."
      description="This view calls your protected channel profile aggregate route and renders the response as a creator-facing profile card."
    >
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form className="studio-card grid content-start gap-4 p-5" onSubmit={onLookup}>
          <SectionHeader kicker="Search" title="Channel lookup" />
          <Field
            defaultValue={channel?.username || currentUser.username}
            label="Username"
            name="username"
            required
          />
          <button className="studio-button-primary" disabled={loading === "channel"} type="submit">
            {loading === "channel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
            Fetch channel
          </button>
          <p className="text-sm leading-6 text-studio-muted">
            Route used: <code className="rounded bg-studio-canvas px-1.5 py-1">GET /api/v1/users/c/:username</code>
          </p>
        </form>

        {channelUser ? (
          <div className="grid gap-5">
            <ProfilePreview user={channelUser} expanded />
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Subscribers" value={channel?.subscribersCount ?? 0} detail="Aggregation count." />
              <StatCard label="Subscribed to" value={channel?.channelsSubscribedToCount ?? 0} detail="Creator follows." />
              <StatCard
                label="You subscribe"
                value={channel?.isSubscribed ? "Yes" : "No"}
                detail="Resolved for current user."
              />
            </div>
          </div>
        ) : (
          <EmptyState
            icon={UsersFallbackIcon}
            title="No channel loaded yet"
            description="Search by username to preview a creator channel from the backend."
          />
        )}
      </div>
    </ViewFrame>
  );
}

function MediaStudioView({ draft, onSaveDraft }) {
  return (
    <ViewFrame
      eyebrow="Media Studio"
      title="Content creation command center."
      description="The UI is ready for videos, tweets, playlists, comments, likes, and subscriptions. Publishing can be connected when those route files are added."
    >
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="studio-card grid content-start gap-4 p-5" onSubmit={onSaveDraft}>
          <SectionHeader kicker="Composer" title="Frontend draft" />
          <Field defaultValue={draft.title} label="Title" name="title" required />
          <label className="grid gap-2">
            <span className="text-sm font-bold text-studio-ink">Description</span>
            <textarea
              className="studio-input min-h-32 resize-y"
              defaultValue={draft.description}
              name="description"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              defaultValue={draft.type}
              label="Format"
              name="type"
              options={["Video", "Tweet", "Playlist"]}
            />
            <SelectField
              defaultValue={draft.visibility}
              label="Visibility"
              name="visibility"
              options={["Public", "Private", "Scheduled"]}
            />
          </div>
          <button className="studio-button-secondary w-fit" type="submit">
            <CheckCircle2 className="h-4 w-4" />
            Save frontend draft
          </button>
        </form>

        <section className="grid gap-5">
          <article className="overflow-hidden rounded-lg border border-studio-line bg-studio-ink text-white shadow-sm">
            <div className="min-h-64 bg-[radial-gradient(circle_at_22%_20%,rgba(34,197,94,0.28),transparent_22rem),linear-gradient(135deg,#176b52,#111411_66%,#dfe8df)] p-6">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                {draft.type} preview
              </span>
              <h2 className="mt-16 max-w-xl text-4xl font-black leading-none tracking-tight">
                {draft.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">{draft.description}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5">
              <Badge>{draft.visibility}</Badge>
              <span className="text-sm text-white/70">Route integration pending</span>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            {modelCards.map((card) => (
              <ModelCard key={card.title} card={card} />
            ))}
          </div>
        </section>
      </div>
    </ViewFrame>
  );
}

function HistoryView({ history, loading, onLoad }) {
  return (
    <ViewFrame
      eyebrow="Watch history"
      title="Recently watched content."
      description="Loads the backend aggregation for videos watched by the current creator account."
      action={
        <button className="studio-button-primary" disabled={loading === "history"} onClick={onLoad} type="button">
          {loading === "history" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Load history
        </button>
      }
    >
      {history.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {history.map((item) => (
            <article className="studio-card overflow-hidden" key={item._id || item.title}>
              <div
                className="grid min-h-48 content-end bg-studio-ink p-5 text-white"
                style={{
                  backgroundImage: item.thumbnail
                    ? `linear-gradient(135deg, rgba(17,20,17,.16), rgba(17,20,17,.75)), url(${item.thumbnail})`
                    : "linear-gradient(135deg, #176b52, #111411)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <span className="text-lg font-black">{item.title || "Untitled video"}</span>
              </div>
              <div className="grid gap-3 p-5">
                <p className="line-clamp-2 text-sm leading-6 text-studio-muted">
                  {item.description || "No description available."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge>{item.views || 0} views</Badge>
                  <Badge>{item.owner?.username || "creator"}</Badge>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Eye}
          title="No watch history loaded"
          description="Click Load history to request data from the protected backend route."
        />
      )}
    </ViewFrame>
  );
}

function ViewFrame({ action, children, description, eyebrow, title }) {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-studio-green">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-none tracking-tight text-studio-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-studio-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-studio-ink text-sm font-black text-white">
        CH
      </div>
      <div>
        <p className="text-base font-black leading-none text-studio-ink">{appName}</p>
        <p className="mt-1 text-xs font-bold text-studio-muted">Creator platform dashboard</p>
      </div>
    </div>
  );
}

function StatusBadge({ compact = false, status }) {
  const content = {
    online: ["API online", "bg-studio-greenSoft text-studio-greenDark"],
    offline: ["API offline", "bg-red-50 text-studio-red"],
    degraded: ["API degraded", "bg-amber-50 text-studio-amber"],
    checking: ["Checking API", "bg-studio-canvas text-studio-muted"],
  }[status || "checking"];

  return (
    <span className={cx("inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold", content[1])}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {compact ? content[0].replace("API ", "") : content[0]}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))]">
      <div
        className={cx(
          "rounded-lg border bg-white p-4 text-sm font-semibold shadow-studio",
          toast.type === "error" ? "border-red-200 text-studio-red" : "border-studio-line text-studio-ink",
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-studio-ink">{label}</span>
      <input className="studio-input" name={name} type={type} {...props} />
    </label>
  );
}

function FileField({ label, name, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-studio-ink">{label}</span>
      <input className="studio-input file:mr-3 file:rounded-md file:border-0 file:bg-studio-greenSoft file:px-3 file:py-2 file:text-sm file:font-bold file:text-studio-greenDark" name={name} type="file" accept="image/*" {...props} />
    </label>
  );
}

function SelectField({ defaultValue, label, name, options }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-studio-ink">{label}</span>
      <select className="studio-input" defaultValue={defaultValue} name={name}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-studio-greenSoft px-3 py-1.5 text-xs font-bold text-studio-greenDark">
      {children}
    </span>
  );
}

function SectionHeader({ action, kicker, title }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        {kicker && (
          <p className="text-xs font-black uppercase tracking-[0.14em] text-studio-muted">
            {kicker}
          </p>
        )}
        <h2 className="mt-1 text-xl font-black tracking-tight text-studio-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatCard({ detail, icon: Icon, label, value }) {
  return (
    <article className="studio-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-studio-muted">{label}</p>
        {Icon && (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-studio-greenSoft text-studio-greenDark">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-4 text-3xl font-black capitalize tracking-tight text-studio-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-studio-muted">{detail}</p>
    </article>
  );
}

function ContentCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="rounded-lg border border-studio-line bg-studio-canvas p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-studio-greenDark">
          <Icon className="h-5 w-5" />
        </div>
        <Badge>{item.status}</Badge>
      </div>
      <h3 className="mt-6 text-lg font-black text-studio-ink">{item.title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-studio-muted">
          {item.format}
        </span>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-studio-muted">
          {item.metric}
        </span>
      </div>
    </article>
  );
}

function FeatureCard({ compact = false, detail, icon, title }) {
  const FeatureIcon = icon || Cloud;

  return (
    <article className={cx("studio-card p-5", compact && "shadow-none")}>
      <div className="flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-studio-ink text-white">
          <FeatureIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-black text-studio-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-studio-muted">{detail}</p>
        </div>
      </div>
    </article>
  );
}

function EndpointCard({ endpoint }) {
  return (
    <article className="rounded-lg border border-studio-line bg-studio-canvas p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-studio-greenDark">
          {endpoint.method}
        </span>
        <ArrowUpRight className="h-4 w-4 text-studio-muted" />
      </div>
      <code className="mt-4 block break-all text-sm font-bold text-studio-greenDark">
        {endpoint.path}
      </code>
      <h3 className="mt-4 font-black text-studio-ink">{endpoint.title}</h3>
      <p className="mt-2 text-sm leading-6 text-studio-muted">{endpoint.detail}</p>
    </article>
  );
}

function ModelCard({ card }) {
  const Icon = card.icon;

  return (
    <article className="studio-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-studio-greenSoft text-studio-greenDark">
          <Icon className="h-5 w-5" />
        </div>
        <Badge>{card.status}</Badge>
      </div>
      <h3 className="mt-5 text-lg font-black text-studio-ink">{card.title}</h3>
      <p className="mt-2 text-sm leading-6 text-studio-muted">{card.description}</p>
      <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-studio-greenDark" type="button">
        API route pending
        <ChevronRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function ProfilePreview({ expanded = false, user }) {
  return (
    <article className="overflow-hidden rounded-lg border border-studio-line bg-white shadow-sm">
      <div
        className={cx("min-h-40 bg-studio-ink", expanded && "min-h-56")}
        style={{
          backgroundImage: user.coverImage
            ? `linear-gradient(135deg, rgba(17,20,17,.08), rgba(17,20,17,.62)), url(${user.coverImage})`
            : "radial-gradient(circle at 20% 20%, rgba(34,197,94,.28), transparent 20rem), linear-gradient(135deg, #dfe8df, #176b52 52%, #111411)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="-mt-14">
            <UserAvatar large user={user} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-studio-ink">{user.fullName}</h3>
            <p className="mt-1 text-sm text-studio-muted">@{user.username}</p>
            <p className="mt-1 text-sm text-studio-muted">{user.email}</p>
          </div>
        </div>
        <Badge>Creator profile</Badge>
      </div>
    </article>
  );
}

function UserAvatar({ large = false, user }) {
  const size = large ? "h-20 w-20 text-xl" : "h-11 w-11 text-sm";

  return (
    <div className={cx("grid shrink-0 place-items-center overflow-hidden rounded-lg border-4 border-white bg-studio-ink font-black text-white", size)}>
      {user.avatar ? (
        <img alt={user.fullName || user.username} className="h-full w-full object-cover" src={user.avatar} />
      ) : (
        initialsFor(user)
      )}
    </div>
  );
}

function EmptyState({ description, icon, title }) {
  const EmptyIcon = icon;

  return (
    <article className="studio-card grid min-h-[420px] place-items-center p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-studio-greenSoft text-studio-greenDark">
          <EmptyIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-2xl font-black text-studio-ink">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-studio-muted">{description}</p>
      </div>
    </article>
  );
}

function UsersFallbackIcon(props) {
  return <Compass {...props} />;
}
