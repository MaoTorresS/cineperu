// src/api/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cineperu-backend.onrender.com/api',
});

export default API;
