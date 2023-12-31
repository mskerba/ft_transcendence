import { useEffect, useState, useRef } from 'react';
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
import LeaderBoard from './Components/LeaderBoard/LeaderBoard';
import Search from './Components/Search/Search';
import io from 'socket.io-client';
import { toast } from 'react-toastify';



const App = () => {
  
  const { auth, login, logout, socketRef, setRandomKey} = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

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


  useEffect(() => {
    // Only create the socket once
    if (socketRef.current === null && auth == 2) {
      socketRef.current = io('http://localhost:3000', {
        transports: ["websocket"],
        withCredentials: true,
      });

      socketRef.current.on('FrontCreatePrivateGame', (data:any) => {
        console.log("chihaja tarya")
        setRandomKey(data.gameID);
        toast(<>
        <button onClick={()=> navigate('/game') }>Accept</button>
        <button>Decline</button>
        </>); 
        console.log("socket --> data :" ,data);
      })

    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [auth]); 


  return (
    <>
    {auth != 1 &&
        <Routes>
          <Route element={ <RequireAuth /> }>
            <Route path="user/:userId" element={ <><NavBar /><Profile /></> } />
            <Route path="/" element={ <> <NavBar /> <Home /> </> } />
            <Route path="/game" element={ <Game /> } />
            <Route path="/chat" element={ <> <NavBar /> <Chat /> </> } />
            <Route path="/leaderboard" element={ <> <NavBar /> <LeaderBoard /> </> } />
            <Route path="/search" element={ <> <NavBar /> <Search /> </> } />
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

