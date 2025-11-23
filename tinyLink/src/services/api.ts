import type { AxiosInstance } from "axios";
import axios from "axios";


// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api" || "http://localhost:5500/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;