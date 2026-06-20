import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-apple-black text-white shadow-premium hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-apple-black dark:hover:bg-zinc-100",
  secondary:
    "border border-apple-line/80 bg-white/70 text-apple-black hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.12]",
  ghost:
    "text-apple-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
};

export default function Button({
  children,
  className = "",
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
