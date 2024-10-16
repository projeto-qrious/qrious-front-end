import axios from "axios";
import { auth } from "../configs/firebaseconfig";

const API_URL = "https://gateway-2g9g.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      console.log(token);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
