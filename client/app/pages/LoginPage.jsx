import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function LoginPage() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("identity") || "").trim();
    const password = String(form.get("password") || "");
    const nextErrors = {};

    if (!identity) nextErrors.identity = "Email or username is required.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(identity.includes("@") ? { email: identity, password } : { username: identity, password });
      navigate("/dashboard");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue your creator workspace."
      subtitle="A calm, secure sign-in surface with JWT-backed API authentication."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Input error={errors.identity} label="Email or username" name="identity" placeholder="manleen or manleen@email.com" />
        <Input error={errors.password} label="Password" name="password" placeholder="Your password" type="password" />
        <Button className="mt-2" isLoading={loading} type="submit">
          Login <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-apple-gray">
        New to VideoTube?{" "}
        <Link className="font-semibold text-apple-black underline-offset-4 hover:underline dark:text-white" to="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children, eyebrow, subtitle, title }) {
  return (
    <Page className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-apple-line/70 bg-white shadow-premium dark:border-white/10 dark:bg-white/[0.05] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-apple-blue">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-apple-black dark:text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-apple-gray">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <Motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="hidden min-h-[620px] bg-gradient-to-br from-black via-zinc-900 to-zinc-300 p-8 text-white lg:grid"
          initial={{ opacity: 0, scale: 0.98 }}
        >
          <div className="mt-auto">
            <span className="rounded-full bg-white/[0.15] px-4 py-2 text-sm font-semibold backdrop-blur">VideoTube OS</span>
            <h2 className="mt-6 max-w-lg text-6xl font-semibold leading-none tracking-[-0.05em]">
              Premium software deserves premium entry points.
            </h2>
          </div>
        </Motion.div>
      </div>
    </Page>
  );
}
