import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Địa chỉ của Flask API
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default instance;
