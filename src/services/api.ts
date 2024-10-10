import axios from "axios";

const API_URL = "http://localhost:3002"; // Seu backend

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para incluir o token JWT no cabeçalho de Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Recupera o token do localStorage

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Adiciona o token ao cabeçalho
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
