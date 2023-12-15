import { useEffect, useState } from 'react';
import Game from "./Components/game/Game";
import Chat from "./Components/Chat/Chat";
import Profile from "./Components/Profile/Profile"
import './App.css'
import Login from './Components/login/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth/RequireAuth';
import { useAuth } from './context/AuthContext';
import NavBar from './Components/navBar/navBar';
import  useAxiosPrivate  from './hooks/UseAxiosPrivate';
import { Navigate, useNavigate } from 'react-router-dom';




const App = () => {
  const { auth, login, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const test = async () => {
      try {
        const response = await axiosPrivate.get('/user/1');
      if (response.status == 200) {
        login(response?.data);
      }
    }
      catch (error) { logout(); }
    }
    test();
  }, [auth]);


  return (
    <>
    {auth != 1 &&
        <>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<><NavBar /><Profile /></>} />
            <Route path="/*" element={<> <NavBar /> <Profile /> </>} />
            <Route path="/game" element={<> <NavBar /> <Game /> </>} />
            <Route path="/chat" element={<> <NavBar /> <Chat /> </>} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
        </>
}
</>
    );
};

export default App;

