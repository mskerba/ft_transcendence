import React, { useEffect, useState } from 'react';
import Game from "./Components/game/Game";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile"
import './App.css'
import Login from './Components/login/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth';
import { useAuth } from './context/AuthContext';
import axios from './api/axios';
import NavBar from './Components/navBar/navBar';




const App = () => {
  const { auth, login } = useAuth();
  console.log("app");

  useEffect(() => {
    const test = async () => {
      const response = await axios.get('/user/1');
      console.log(response.status);
      if (response.status == 200) {
        login();
      }
      console.log("--->", auth);
    }
    test();
  }, [auth]);


  return (
    <>
        <NavBar />
        <Routes>
          <Route element={<RequireAuth auth={auth}/>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/game" element={<Game />} />
            <Route path="/Chat" element={<Chat />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
    </>
  );
};

export default App;

