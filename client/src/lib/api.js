const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "creatorhub.accessToken";

const endpoints = {
  register: "/api/v1/users/register",
  login: "/api/v1/users/login",
  logout: "/api/v1/users/logout",
  refresh: "/api/v1/users/refresh-token",
  currentUser: "/api/v1/users/current-user",
  updateAccount: "/api/v1/users/update-account",
  changePassword: "/api/v1/users/change-password",
  avatar: "/api/v1/users/avatar",
  cover: "/api/v1/users/cover-image",
  channel: (username) => `/api/v1/users/c/${encodeURIComponent(username)}`,
  history: "/api/v1/users/history",
  health: "/api/v1/health",
};

export const sessionStore = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  },
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  },
};

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiRequest(path, options = {}) {
  const token = sessionStore.getToken();
  const headers = new Headers(options.headers || {});
  const init = {
    method: options.method || "GET",
    credentials: "include",
    headers,
  };

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body instanceof FormData) {
    init.body = options.body;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const payload = await parseResponse(response);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with ${response.status}`);
  }

  return payload;
}

export const api = {
  endpoints,
  baseUrl: API_BASE_URL,
  health: () => apiRequest(endpoints.health, { auth: false }),
  login: (body) => apiRequest(endpoints.login, { method: "POST", body, auth: false }),
  register: (formData) =>
    apiRequest(endpoints.register, { method: "POST", body: formData, auth: false }),
  logout: () => apiRequest(endpoints.logout, { method: "POST" }),
  currentUser: () => apiRequest(endpoints.currentUser),
  updateAccount: (body) =>
    apiRequest(endpoints.updateAccount, { method: "PATCH", body }),
  changePassword: (body) =>
    apiRequest(endpoints.changePassword, { method: "POST", body }),
  updateAvatar: (formData) =>
    apiRequest(endpoints.avatar, { method: "PATCH", body: formData }),
  updateCover: (formData) =>
    apiRequest(endpoints.cover, { method: "PATCH", body: formData }),
  channel: (username) => apiRequest(endpoints.channel(username)),
  history: () => apiRequest(endpoints.history),
};
