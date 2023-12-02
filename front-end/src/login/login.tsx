import React, { useState, useEffect } from 'react';
import './login.css'

const Login = () => {

  return (
    <div className='login-container'>
      <h1>Welcome back</h1>
      <p>Welcome to the Ping Pong Party! Smash some rallies, chat with your ping pong pals, and sign in to the fun. Let's bounce into the action! 🏓🎉</p>
      <a href="http://localhost:3000/auth/google/" className="login-button">
        <svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink" viewBox="0 0 210 210" xml: space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40 c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105 S0,162.897,0,105z"></path> </g></svg>
        Continue with Google
      </a>
      <a href="http://localhost:3000/auth/42/" className="login-button">
      <svg version="1.1"
        id="Calque_1" sodipodi:docname="42_logo.svg" inkscape:version="0.48.2 r9819" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 -200 960 960"
        enable-background="new 0 -200 960 960" xml:space="preserve">
      <polygon id="polygon5" points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1 
        32,279.1 "/>
      <polygon id="polygon7" points="597.9,114.2 762.7,-51.1 597.9,-51.1 "/>
      <polygon id="polygon9" points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1 "/>
      <polygon id="polygon11" points="928,279.1 762.7,443.9 928,443.9 "/>
      </svg>
        Continue with 42 intra
      </a>
    </div>
  );
};

export default Login;
