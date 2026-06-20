import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "videotube.accessToken";

export const tokenStore = {
  get() {
    return localStorage.getItem(TOKEN_KEY) || "";
  },
  set(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export const authApi = {
  login(payload) {
    return apiClient.post("/api/v1/users/login", payload);
  },
  register(formData) {
    return apiClient.post("/api/v1/users/register", formData);
  },
  logout() {
    return apiClient.post("/api/v1/users/logout");
  },
  currentUser() {
    return apiClient.get("/api/v1/users/current-user");
  },
  updateAccount(payload) {
    return apiClient.patch("/api/v1/users/update-account", payload);
  },
  changePassword(payload) {
    return apiClient.post("/api/v1/users/change-password", payload);
  },
  updateAvatar(formData) {
    return apiClient.patch("/api/v1/users/avatar", formData);
  },
  updateCover(formData) {
    return apiClient.patch("/api/v1/users/cover-image", formData);
  },
  channel(username) {
    return apiClient.get(`/api/v1/users/c/${encodeURIComponent(username)}`);
  },
  history() {
    return apiClient.get("/api/v1/users/history");
  },
  health() {
    return apiClient.get("/api/v1/health");
  },
};

export { API_BASE_URL };
