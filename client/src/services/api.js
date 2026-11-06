import axios from 'axios';

// ONE configured Axios instance used by every page. Change the server address in one place.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// REQUEST INTERCEPTOR: runs before EVERY request leaves the browser.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('annaseva_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // the "wristband"
  }
  return config;
});

// RESPONSE INTERCEPTOR: runs on every response (or error) coming back.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest =
      error.config?.url?.startsWith('/auth/login') ||
      error.config?.url?.startsWith('/auth/register');
    // A 401 on a normal request means the token expired or is invalid: clear it and go to login.
    // (A 401 from the login form itself just means "wrong password": the page shows that message.)
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('annaseva_token');
      localStorage.removeItem('annaseva_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
