import { useState } from "react";
import Button from "./ui/Button";
import axios from "axios";

export default function DeploymentGuard({ children }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!!localStorage.getItem("deployment_password"));

  if (isUnlocked) {
    return children;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      await axios.get("/api/v1/users/current-user", {
        headers: {
          "x-deployment-password": password.trim()
        }
      });
      
      // If 200 OK, it passed the guard
      localStorage.setItem("deployment_password", password.trim());
      setIsUnlocked(true);
      window.location.reload();
    } catch (err) {
      if (err.response?.data?.message === "Deployment password required or invalid") {
        setError("Invalid deployment password.");
      } else if (err.response?.status === 401) {
        // If 401 Unauthorized request, it means the guard passed but user is not logged in!
        localStorage.setItem("deployment_password", password.trim());
        setIsUnlocked(true);
        window.location.reload();
      } else {
        setError("Could not connect to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-apple-cloud dark:bg-apple-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-apple-gray">
        <h1 className="mb-2 text-2xl font-semibold text-apple-black dark:text-white">Protected Environment</h1>
        <p className="mb-6 text-sm text-apple-gray dark:text-apple-cloud">
          Please enter the deployment password to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter password"
            className={`rounded-lg border bg-transparent p-3 text-apple-black outline-none focus:border-apple-blue dark:text-white ${
              error ? "border-red-500" : "border-apple-line dark:border-white/[0.15]"
            }`}
            autoFocus
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Unlock
          </Button>
        </form>
      </div>
    </div>
  );
}
