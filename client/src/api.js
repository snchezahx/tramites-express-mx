import axios from 'axios';

// Configure axios base URL for production
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 60000, // 60 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
