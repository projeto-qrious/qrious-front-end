import axios from "axios";

const API_URL = "http://172.16.34.82:3001";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
