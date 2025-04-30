import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService'; // Import authService

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state for initial auth check

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        localStorage.setItem('token', token);
        try {
          // Fetch user details using the token
          const response = await authService.getCurrentUser(token);
          setUser(response.data); // Set user data
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // Token might be invalid/expired, clear it
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false); // Finished loading
    };

    verifyUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken); // This triggers the useEffect to fetch user data
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Optionally add cleanup logic (e.g., socket disconnect)
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
      {!loading && children} {/* Render children only after loading is complete */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
}; 