import { Moon, Sun } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="relative h-10 w-20 rounded-full border border-apple-line/70 bg-white/70 p-1 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-white/10"
      type="button"
      onClick={toggleTheme}
    >
      <Motion.span
        animate={{ x: isDark ? 39 : 0 }}
        className="absolute left-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-apple-black text-white shadow-sm dark:bg-white dark:text-apple-black"
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Motion.span>
    </button>
  );
}
