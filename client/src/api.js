import axios from 'axios';

// Configure axios base URL for production
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
});

export default api;
