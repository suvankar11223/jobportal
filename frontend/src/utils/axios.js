import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(
    (config) => {
        // Ensure withCredentials is set for all requests
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized errors globally if needed
            console.error('Authentication error:', error.response.data?.message);
        }
        return Promise.reject(error);
    }
);

export default axios;
