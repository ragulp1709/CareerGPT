import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

const getDevUserId = () => {
  const match = document.cookie.match(/(?:^|; )dev_session=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "dev_user_local";
};

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Attach user ID to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userId = bypassAuth
      ? getDevUserId()
      : localStorage.getItem("clerk_user_id");
    if (userId) {
      config.headers["x-clerk-user-id"] = userId;
    }
  }
  return config;
});

export default apiClient;
