import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

const links = [
  { label: "Explore", to: "/feed" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Profile", to: "/profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query");
    navigate(`/feed?search=${encodeURIComponent(query || "")}`);
    setOpen(false);
  }

  return (
    <Motion.header
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-apple-line/60 bg-white/70 backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-apple-black/70"
      initial={{ y: -16, opacity: 0 }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-apple-black text-sm font-bold text-white dark:bg-white dark:text-apple-black">
            VT
          </span>
          <span className="text-sm font-semibold tracking-tight text-apple-black dark:text-white">
            VideoTube
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-apple-black dark:text-white"
                    : "text-apple-gray hover:text-apple-black dark:hover:text-white"
                }`
              }
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <form className="hidden w-full max-w-xs items-center gap-2 rounded-full border border-apple-line/70 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/[0.08] lg:flex" onSubmit={handleSearch}>
          <Search className="h-4 w-4 text-apple-gray" />
          <input
            className="w-full bg-transparent text-sm text-apple-black outline-none placeholder:text-apple-gray dark:text-white"
            name="query"
            placeholder="Search VideoTube"
          />
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-apple-black text-sm font-semibold text-white dark:bg-white dark:text-apple-black" to="/profile">
                {user.avatar ? <img alt={user.fullName} className="h-full w-full object-cover" src={user.avatar} /> : <UserRound className="h-5 w-5" />}
              </Link>
              <Button variant="secondary" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")}>Start free</Button>
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 text-apple-black transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10 lg:hidden"
          type="button"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-apple-line/60 bg-white/95 p-4 dark:border-white/10 dark:bg-apple-black/95 lg:hidden">
          <form className="mb-4 flex items-center gap-2 rounded-full border border-apple-line/70 px-4 py-3 dark:border-white/10" onSubmit={handleSearch}>
            <Search className="h-4 w-4 text-apple-gray" />
            <input className="w-full bg-transparent text-sm outline-none dark:text-white" name="query" placeholder="Search" />
          </form>
          <div className="grid gap-2">
            {links.map((link) => (
              <Link className="rounded-2xl px-4 py-3 text-sm font-semibold text-apple-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10" key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-apple-black dark:text-white">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </Motion.header>
  );
}
