import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : "https://meu-json-server.onrender.com";

const api = axios.create({
  baseURL,
});

export default api;
