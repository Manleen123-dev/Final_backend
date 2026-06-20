import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, tokenStore } from "../services/apiClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function restoreSession() {
      if (!tokenStore.get()) {
        setBooting(false);
        return;
      }

      try {
        const response = await authApi.currentUser();
        setUser(response.data);
      } catch {
        tokenStore.set("");
      } finally {
        setBooting(false);
      }
    }

    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      booting,
      user,
      async login(payload) {
        const response = await authApi.login(payload);
        tokenStore.set(response.data?.accessToken);
        setUser(response.data?.user);
        showToast(response.message || "Welcome back.");
        return response;
      },
      async register(formData) {
        const response = await authApi.register(formData);
        showToast(response.message || "Account created. You can log in now.");
        return response;
      },
      async logout() {
        try {
          await authApi.logout();
        } finally {
          tokenStore.set("");
          setUser(null);
          showToast("Signed out successfully.");
        }
      },
      async refreshUser() {
        const response = await authApi.currentUser();
        setUser(response.data);
        return response;
      },
      setUser,
    }),
    [booting, showToast, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
