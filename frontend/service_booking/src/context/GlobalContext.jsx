import { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const USER_KEY = 'user';
  const TOKEN_KEY = 'token';
  // New keys requested by user for visibility in Chrome
  const EMAIL_KEY = 'user_email';
  const NAME_KEY = 'user_name';
  const PASS_KEY = 'user_password';

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error loading user from storage:', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);

  // Sync existing user data to visibility keys if already logged in
  useEffect(() => {
    if (user) {
      localStorage.setItem(EMAIL_KEY, user.email);
      localStorage.setItem(NAME_KEY, user.name);
    }
  }, []);

  // Synchronize state changes to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(EMAIL_KEY, user.email);
      localStorage.setItem(NAME_KEY, user.name);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(PASS_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(PASS_KEY);
  };

  const login = (userData, userToken, password) => {
    setUser(userData);
    setToken(userToken);
    
    // Immediate save for absolute certainty
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, userToken);
      localStorage.setItem(EMAIL_KEY, userData.email);
      localStorage.setItem(NAME_KEY, userData.name);
      if (password) {
        localStorage.setItem(PASS_KEY, password);
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, token, notifications, setNotifications, logout, login, loading, setLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
