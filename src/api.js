import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : "https://coffee-ledger.onrender.com";

const api = axios.create({
  baseURL,
});

export default api;
