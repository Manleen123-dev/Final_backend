import { motion as Motion } from "framer-motion";

export default function Page({ children, className = "" }) {
  return (
    <Motion.main
      animate={{ opacity: 1, y: 0 }}
      className={className}
      exit={{ opacity: 0, y: 12 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.main>
  );
}
