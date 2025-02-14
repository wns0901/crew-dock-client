import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,

  post: {
    'Content-Type': "application/json;charset=utf-8",
  },
  
  patch: {
    'Content-Type': "application/json;charset=utf-8",
  },

  put: {
    'Content-Type': "application/json;charset=utf-8",
  }
})

export default api;