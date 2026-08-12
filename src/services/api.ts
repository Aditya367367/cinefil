  import axios from 'axios';

  // Define the root API endpoint as a global service variable
  export const API_ROOT = import.meta.env.VITE_API_URL ||'http://192.168.1.148:8000/api/v1';

  const api = axios.create({
    baseURL: API_ROOT,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for HttpOnly cookies support
  });

  // Request Interceptor: Attach bearer token if present in localStorage
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Automatically refresh JWT token on 401 Unauthorized
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 429 Rate Limit: parse wait time and throw friendly message
      if (error.response?.status === 429) {
        const detail: string = error.response?.data?.detail || "";
        const match = detail.match(/(\d+)\s*second/i);
        const seconds = match ? parseInt(match[1], 10) : null;
        let friendlyMsg = "You've made too many requests. Please wait before trying again.";
        if (seconds !== null) {
          const retryAt = new Date(Date.now() + seconds * 1000);
          const timeStr = retryAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          friendlyMsg = `Too many requests. Please try again at ${timeStr}.`;
        }
        return Promise.reject(new Error(friendlyMsg));
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refresh = localStorage.getItem('refresh_token');
          if (refresh) {
            const { data } = await axios.post(`${API_ROOT}/auth/token/refresh/`, { refresh }, { withCredentials: true });
            if (data.access) {
              localStorage.setItem('access_token', data.access);
              originalRequest.headers.Authorization = `Bearer ${data.access}`;
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          // Clear local storage and log out if token refresh fails
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      return Promise.reject(error);
    }
  );

  export default api;
