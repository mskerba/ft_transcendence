import React, { useState, useEffect } from 'react';
import './login.css'

const GoogleLoginButton = () => {

  return (
    <div className='login'>
      <h1>NeonPong</h1>
      <ul>
        <li><a className="google" href="http://localhost:3000/auth/google/"><img src="src/assets/google.png" alt='google'/>Continue with Google</a></li>
        <li><a className="intra" href="http://localhost:3000/auth/42/"><img src="src/assets/42.svg" alt='42'/>Continue with 42 intra</a></li>
      </ul>
      
    </div>
  );
};

export default GoogleLoginButton;
