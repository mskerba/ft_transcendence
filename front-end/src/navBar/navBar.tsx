import React, { useState } from 'react'
import './navBar.css';


const NavBar = () => {
  
  return (
    <nav className='navbar-' >
      <ul>
        <div>
          <li>
            <h1>
            <img src="src/assets/pingpong.png" />
            PingPong</h1>
          </li>
          <li>
            <input 
            type="text"
            placeholder="Search..."
            // value={searchQuery}
            // onChange={handleSearch}
            />
          </li>
        </div>

        <div>
          <li><a>Game</a></li>
          <li><a>Chat</a></li>
          <li><a>Home</a></li>
        </div>

        <div>
          <li>Profile</li>
          <li>Exit</li>
        </div>
        
      </ul>
    </nav>
  );
};

export default NavBar;
