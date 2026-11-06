import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'annaseva_token';
const USER_KEY = 'annaseva_user';

// createContext makes the "shared backpack". null is the default when no provider exists.
const AuthContext = createContext(null);

// Read the saved user from the browser's storage (it may be missing or corrupted).
function readSavedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Passing a FUNCTION to useState means it runs only once on initial render.
  const [user, setUser] = useState(readSavedUser);
  // "loading" is true until we have verified the saved token with the backend.
  const [loading, setLoading] = useState(true);

  // On initial mount: if a token exists, verify with GET /api/auth/me
  useEffect(() => {
    async function confirmSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        // Backend returns: { status: 'success', data: { user } }
        const verifiedUser = data.data?.user || data.user;
        if (verifiedUser) {
          localStorage.setItem(USER_KEY, JSON.stringify(verifiedUser));
          setUser(verifiedUser);
        } else {
          clearSession();
        }
      } catch {
        // Token expired, revoked, or tampered with
        clearSession();
      } finally {
        setLoading(false);
      }
    }
    confirmSession();
  }, []);

  function saveSession(payload) {
    const token = payload.token;
    const userData = payload.data?.user || payload.user;

    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = saveSession(data);
    return userData;
  }

  async function register(form) {
    const { data } = await api.post('/auth/register', form);
    const userData = saveSession(data);
    return userData;
  }

  // Everything inside value becomes accessible to components calling useAuth()
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout: clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
