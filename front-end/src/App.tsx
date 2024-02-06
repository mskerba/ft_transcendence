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
import useAxiosPrivate from './hooks/UseAxiosPrivate';
import { Navigate, useNavigate } from 'react-router-dom';
import TwoFactorVerification from './Components/TwoFactorAuth/TwoFactorAuth';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';
import LeaderBoard from './Components/LeaderBoard/LeaderBoard';
import Search from './Components/Search/Search';
import io from 'socket.io-client';
import { toast } from 'react-toastify';



const App = () => {

  const { rootAppStyle, auth, login, logout, socketRef, setRandomKey, authUser } :any= useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosPrivate.get('/user');
        login(res?.data);
      }
      catch (error) { logout(); }
    }
    fetchUser();
    const intervalId = setInterval(fetchUser, 5000);

    return () => clearInterval(intervalId);
  }, [auth]);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);


  useEffect(() => {
    // Only create the socket once
    if (socketRef.current === null && auth == 2) {
      socketRef.current = io('http://localhost:3000', {
        query: { userId: authUser.userId },
        transports: ["websocket"],
        withCredentials: true,
      });

      const handleDecline = (to: string) => {
        console.log("send event to decline:", to)
        socketRef.current.emit("removePrivateGame", { to: to });
        setRandomKey("");

      }


      socketRef.current.on('toHome', () => { console.log("Waaaghayerha"); navigate('/') })

      socketRef.current.on('FrontCreatePrivateGame', (data: any) => {
        console.log(data);
        setRandomKey(data.gameID);
        toast(<><h3 className='challenger-name'>{data.from}</h3>
          <div className='game-request'>
            <button className='accept-game' onClick={() => navigate('/game')}>Accept</button>
            <button className='decline-game' onClick={() => handleDecline(data.from)}>Decline</button>
          </div>
        </>);
        console.log("socket --> data :", data);
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
    <div className="rout_app" style={rootAppStyle}>
      {auth != 1 &&
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="user/:userId" element={<><NavBar /><Profile /></>} />
            <Route path="/leaderboard" element={<> <NavBar /> <LeaderBoard /> </>} />
            <Route path="/game" element={<Game />} />
            <Route path="/" element={<> <NavBar /> <Home /></>} />
            <Route path="/chat" element={<> <NavBar /> <Chat /> </>} />
            <Route path="/search" element={<> <NavBar /> <Search /> </>} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/2FA" element={<TwoFactorVerification />} />
          <Route path="/*" element={<NotFound />} />

        </Routes>
      }
    </div>
  );
};

export default App;

