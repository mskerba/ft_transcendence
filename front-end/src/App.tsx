import { useEffect, useState } from 'react';
import Game from "./Components/game/Game";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile"
import './App.css'
import Login from './Components/login/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth';
import { useAuth } from './context/AuthContext';
import NavBar from './Components/navBar/navBar';
import  useAxiosPrivate  from './hooks/UseAxiosPrivate';




const App = () => {
  const { auth, login, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  console.log("app");

  useEffect(() => {
    const test = async () => {
      try {
      const response = await axiosPrivate.get('/user/1');
      console.log(response.status);
      if (response.status == 200) {
        login(response?.data);
      }
    }
      catch (error) { logout(); }
    }
    test();
    console.log("--->", auth);
  }, [auth]);


  return (
    <>
    {auth != 1 &&
        <>
        <NavBar />
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<Profile />} />
            <Route path="/game" element={<Game />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
        </>
}
</>
    );
};

export default App;

