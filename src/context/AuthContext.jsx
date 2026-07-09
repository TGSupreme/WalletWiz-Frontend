import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setLogoutCallback } from '../services/api';

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('walletwiz_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('walletwiz_token', token);
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.sub || decoded.user_id,
          email: decoded.email || decoded.sub || 'User',
          firstName: decoded.first_name || localStorage.getItem('walletwiz_first_name') || 'Member',
        });
      } else {
        setUser({ firstName: 'Member' });
      }
    } else {
      localStorage.removeItem('walletwiz_token');
      localStorage.removeItem('walletwiz_first_name');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Wire up the API wrapper logout callback to trigger local state reset
  useEffect(() => {
    setLogoutCallback(() => {
      logout();
    });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response && response.access_token) {
        setToken(response.access_token);
        return { success: true };
      }
      throw new Error('Invalid login response');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (email, password, firstName) => {
    setLoading(true);
    try {
      const response = await authAPI.register(email, password, firstName);
      if (response && response.user_id) {
        localStorage.setItem('walletwiz_first_name', firstName);
        // Automatically log in the user after registration
        return await login(email, password);
      }
      throw new Error('Invalid registration response');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginGoogle = async (idToken) => {
    setLoading(true);
    try {
      const response = await authAPI.loginGoogle(idToken);
      if (response && response.access_token) {
        setToken(response.access_token);
        return { success: true };
      }
      throw new Error('Google sign-in failed');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('walletwiz_token');
    localStorage.removeItem('walletwiz_first_name');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
