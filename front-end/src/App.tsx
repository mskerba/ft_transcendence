import React, { useState } from 'react'
import Game from "./game/Game";
import Profile from "./Profile/Profile"
import './App.css'
import Login from './login/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavBar from './navBar/navBar';


const App = () => {
  return (
    // <>
    // <NavBar/>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    // </>
  );
};

export default App;

