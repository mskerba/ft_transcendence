import React, { useState } from 'react'
import Game from "./game/Game";
import './App.css'
import GoogleLoginButton from './auth/login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<GoogleLoginButton />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  </Router>
  );
};

export default App;

