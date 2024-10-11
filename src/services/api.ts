import axios from "axios";

const API_URL = "http://192.168.1.103:3002";

const api = axios.create({
  baseURL: API_URL,
});

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
