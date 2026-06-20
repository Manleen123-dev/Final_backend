import { X } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";

export default function Modal({ children, isOpen, onClose, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <Motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-xl rounded-[2rem] p-6 shadow-premium"
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-apple-black dark:text-white">{title}</h2>
              <button
                className="rounded-full p-2 text-apple-gray transition hover:bg-black/5 dark:hover:bg-white/10"
                type="button"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
