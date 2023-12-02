import React, { useState } from 'react'
import './navBar.css';


const NavBar = () => {
  
  return (
    <nav className='navbar-' >
      <ul>
        <div>
          <li>
            <h1>
            <img src="src/assets/pp.png" />
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
          <li><svg fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path clip-rule="evenodd" d="m11.98.3h-4.94c-1.51 0-2.74 1.23-2.74 2.74v1.96h1.4v-1.96c0-.74.6-1.34 1.34-1.34h4.94c.74 0 1.34.6 1.34 1.34v9.91c0 .74-.6 1.34-1.34 1.34h-4.94c-.74 0-1.34-.6-1.34-1.34v-1.95h-1.4v1.96c0 1.51 1.23 2.74 2.74 2.74h4.94c1.51 0 2.74-1.23 2.74-2.74v-9.92c0-1.51-1.23-2.74-2.74-2.74zm-3.98 11.7 4-4-4-4v3.3h-7v1.4h7z"></path> </g></svg></li>
        </div>
        
      </ul>
    </nav>
  );
};

export default NavBar;
