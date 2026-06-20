import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import { FileInput, Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { AuthShell } from "./LoginPage";

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors = {};

    ["fullName", "username", "email", "password"].forEach((field) => {
      if (!String(form.get(field) || "").trim()) nextErrors[field] = "Required.";
    });

    if (!form.get("avatar")?.size) nextErrors.avatar = "Avatar is required.";
    if (String(form.get("password") || "").length < 6) {
      nextErrors.password = "Use at least 6 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Start your premium creator profile."
      subtitle="Upload an avatar, optional cover, and create a profile powered by your backend."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input error={errors.fullName} label="Full name" name="fullName" placeholder="Manleen Kaur" />
          <Input error={errors.username} label="Username" name="username" placeholder="manleen" />
        </div>
        <Input error={errors.email} label="Email" name="email" placeholder="you@email.com" type="email" />
        <Input error={errors.password} label="Password" name="password" placeholder="Minimum 6 characters" type="password" />
        <FileInput accept="image/*" error={errors.avatar} label="Avatar" name="avatar" />
        <FileInput accept="image/*" label="Cover image" name="coverImage" />
        <Button className="mt-2" isLoading={loading} type="submit">
          Create account <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-apple-gray">
        Already registered?{" "}
        <Link className="font-semibold text-apple-black underline-offset-4 hover:underline dark:text-white" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
