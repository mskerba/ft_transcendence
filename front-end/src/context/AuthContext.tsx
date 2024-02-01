import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const socketRef = useRef(null);
  const [auth, setAuth] = useState(1);
  const [authUser, setAuthUser] = useState({});
  const [randomKey, setRandomKey]:any = useState<string>("");
  const [rootAppStyle, setRootAppStyle]:any = useState({});
  const [convInf, setConvInf]:any = useState({
    Avatar : "",
    Name: "",
    convId : "",
    group: "",
    Id:"",
  });

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
    <AuthContext.Provider value={{rootAppStyle, setRootAppStyle, socketRef, auth, loading, login, logout, authUser, setAuthUser, randomKey, setRandomKey, convInf, setConvInf }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
