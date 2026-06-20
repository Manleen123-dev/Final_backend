import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const value = useMemo(
    () => ({
      showToast(message, type = "success") {
        setToast({ id: Date.now(), message, type });
        window.setTimeout(() => setToast(null), 4200);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <Motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-5 right-5 z-[80] w-[min(420px,calc(100vw-2.5rem))]"
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
          >
            <div className="glass-panel flex items-start gap-3 rounded-2xl p-4 shadow-premium">
              {toast.type === "error" ? (
                <XCircle className="mt-0.5 h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
              )}
              <p className="text-sm font-medium text-apple-black dark:text-white">
                {toast.message}
              </p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
