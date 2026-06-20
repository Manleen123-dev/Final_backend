import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function Input({ error, label, name, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label className="grid gap-2">
      {label && <span className="text-sm font-semibold text-apple-black dark:text-white">{label}</span>}
      <span className="relative">
        <input
          className={`h-12 w-full rounded-2xl border bg-white/80 px-4 text-sm text-apple-black outline-none transition duration-300 placeholder:text-apple-gray focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 dark:bg-white/[0.07] dark:text-white dark:placeholder:text-white/35 ${
            error ? "border-red-400" : "border-apple-line/80 dark:border-white/10"
          } ${isPassword ? "pr-12" : ""}`}
          name={name}
          type={inputType}
          {...props}
        />
        {isPassword && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-apple-gray transition hover:bg-black/5 dark:hover:bg-white/10"
            type="button"
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </span>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

export function FileInput({ error, label, name, ...props }) {
  return (
    <label className="grid gap-2">
      {label && <span className="text-sm font-semibold text-apple-black dark:text-white">{label}</span>}
      <input
        className={`w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-apple-gray outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-apple-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white dark:bg-white/[0.07] dark:file:bg-white dark:file:text-apple-black ${
          error ? "border-red-400" : "border-apple-line/80 dark:border-white/10"
        }`}
        name={name}
        type="file"
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}
