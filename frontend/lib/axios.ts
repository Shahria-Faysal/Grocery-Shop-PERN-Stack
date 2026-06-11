import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://grocery-shop-pern-stack.onrender.com",
  withCredentials: true
});

export default api;