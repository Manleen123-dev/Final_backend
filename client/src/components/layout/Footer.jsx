import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-apple-line/70 bg-white/70 py-12 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm text-apple-gray sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-apple-black text-sm font-bold text-white dark:bg-white dark:text-apple-black">
              VT
            </span>
            <span className="font-semibold text-apple-black dark:text-white">VideoTube</span>
          </div>
          <p className="max-w-sm leading-6">
            A premium creator platform frontend built for a resume-level full-stack project.
          </p>
        </div>
        {[
          ["Product", "Explore", "Dashboard", "Analytics"],
          ["Company", "About", "Careers", "Press"],
          ["Resources", "Docs", "API", "Status"],
        ].map(([title, ...items]) => (
          <div key={title}>
            <h3 className="mb-4 font-semibold text-apple-black dark:text-white">{title}</h3>
            <div className="grid gap-3">
              {items.map((item) => (
                <Link className="transition hover:text-apple-black dark:hover:text-white" key={item} to="/feed">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
