import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

  const login = () => {
    // Implement your login logic, and set isLoggedIn to true
    setAuth(true);
  };

  const logout = () => {
    // Implement your logout logic, and set isLoggedIn to false
    setAuth(false);
  };


  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
