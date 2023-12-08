import React, { useState } from 'react'
import './navBar.css';


const NavBar = () => {
  
  return (
    <nav className='navbar-' >
      <ul>
        <div className='logo-search'>
          <li>
            <h1>
            <img src="src/assets/pingpong.png" />
            PingPong</h1>
          </li>
          <li>
            <input 
            type="text"
            placeholder="Search..."
            className='big-size-search'
            // value={searchQuery}
            // onChange={handleSearch}
            />
          </li>
        </div>

        <div className='middle-navbar'>
          <li><a>Game</a></li>
          <li><a>Home</a></li>
          <li><a>Chat</a></li>
        </div>

        <div className='middle-navbar-min'>
          <li><img src='src/assets/games.svg' /></li>
          <li><img src='src/assets/home.svg' /></li>
          <li><img src='src/assets/chat-white-icone.svg' /></li>
        </div>

        <div className='profile-exit'>
          <li><img src="https://thispersondoesnotexist.com" className='profile-button-navbar'/></li>
          <li><img src='src/assets/exit.svg' /></li>
        </div>
        
      </ul>
      
      <input 
            type="text"
            placeholder="Search..."
            className='small-size-search'
            // value={searchQuery}
            // onChange={handleSearch}
            />
    </nav>
  );
};``

export default NavBar;
