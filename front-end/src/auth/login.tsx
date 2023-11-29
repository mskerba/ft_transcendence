import React, { useState, useEffect } from 'react';
import './login.css'

const Login = () => {

  return (
    <div className='login'>
      <h1>Welcome back</h1>
      <p>Welcome to the Ping Pong Party! Smash some rallies, chat with your ping pong pals, and sign in to the fun. Let's bounce into the action! 🏓🎉</p>
      <a href="http://localhost:3000/auth/google/" className="icon-button">
        <img src="src/assets/google.png" alt='google' className='icon'/>
        Continue with Google
      </a>
      <a href="http://localhost:3000/auth/42/" className="icon-button">
        <img src="src/assets/42.svg" alt='42' className='icon'/>
        Continue with 42 intra
      </a>
    </div>
  );
};

export default Login;

{/* <a href="#" className="icon-button">
<img src="icon.png" alt="Icon" className="icon" width="20" height="20">
Continue with Google
</a> */}
