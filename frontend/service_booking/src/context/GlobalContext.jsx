import { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Member',
    avatar: 'JD'
  });

  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);

  // useEffect demonstration: Simulated login check
  useEffect(() => {
    console.log('Global Context Initialized');
    // In a real app, this would check localStorage or an auth token
  }, []);

  const logout = () => {
    setUser(null);
  };

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, notifications, setNotifications, logout, login, loading, setLoading }}>
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
