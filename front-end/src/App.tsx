import { useEffect, useState } from 'react';
import Game from "./Components/game/Game";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile"
import Modal from 'react-modal';
import './App.css'
import Login from './Components/login/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import { useAuth } from './context/AuthContext';
import NavBar from './Components/navBar/navBar';
import  useAxiosPrivate  from './hooks/UseAxiosPrivate';
import { Navigate, useNavigate } from 'react-router-dom';
import TwoFactorVerification from './Components/TwoFactorAuth/TwoFactorAuth';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';




const App = () => {
  const { auth, login, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const test = async () => {
      try {
        const res = await axiosPrivate.get('/user');
      if (res.status == 200) {
        login(res?.data);
      }
    }
      catch (error) { logout(); }
    }
    test();
  }, [auth]);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);



  return (
    <>
    {auth != 1 &&
        <Routes>
          <Route element={ <RequireAuth /> }>
            <Route path="user/:userId" element={ <><NavBar /><Profile /></> } />
            <Route path="/" element={ <> <NavBar /> <Home /> </> } />
            <Route path="/game" element={ <> <Game /> </> } />
            <Route path="/chat" element={ <> <NavBar /> <Chat /> </> } />
          </Route>

          <Route path="/login" element={ <Login /> } />
          <Route path="/2FA" element={ <TwoFactorVerification /> } />
          <Route path="/*" element={ <NotFound /> } />

        </Routes>
    }
</>
    );
};

export default App;

