import axios from "axios";

const hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";

const API = axios.create({
  baseURL: `http://${hostname}:5000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization Bearer token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillswap_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
