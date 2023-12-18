import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(1);
  const [authUser, setAuthUser] = useState({});

  const login = (user: any) => {
    setAuth(2);
    setAuthUser(user);
  };

  const logout = () => {
    setAuth(0);
    setAuthUser({});
  };

  const loading = () => {
    setAuth(1);
  };


  return (
    <AuthContext.Provider value={{ auth, loading, login, logout, authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
