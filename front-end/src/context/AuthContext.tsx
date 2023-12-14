import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(1);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const login = (user) => {
    setAuth(2);
    setUser(user);
  };

  const logout = () => {
    setAuth(0);
    setUser({});
    Navigate("/login");
  };

  const loading = () => {
    setAuth(1);
  };


  return (
    <AuthContext.Provider value={{ auth, loading, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
