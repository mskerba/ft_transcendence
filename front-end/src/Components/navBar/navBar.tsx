import React, { useState } from 'react'
import './navBar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';


const NavBar = () => {

  const [divPosition, setDivPosition]:any = useState({ x: 0,
    y: 0,
    display: 'none',
  })

  function handleMoreInfClick(event:any) { 
    const { clientX, clientY } = event;
    setDivPosition((prev:any) => 
                          {
                            let display = (prev.display == 'none')? 'flex' : 'none';
                            return{ x: `${clientX}px`,
                                    y: `${clientY}px`,
                                    display: display,
                                  }
                          });
  }

  const { logout } = useAuth();



  const handleLogout = async () => {
  
    try {
      await axios.get('auth/logout');
    } catch (errot) {}
    logout();
    
  }
  
  
  return (
    <>

        <div style={{top: divPosition.x, left: divPosition.y, display: divPosition.display}} className='dropdown-navbar-ham'>
          <ul>
            <li><Link to="/game">Game</Link></li>
            <li>Home</li>
            <li><Link to="/chat">Chat</Link></li>
            <div className='dropdown-ham-profile'>
              <li><Link to="/profile">Profile</Link></li>
              <li>Exit</li>
            </div>
          </ul>
        </div>

        <div style={{display:divPosition.display}} className='closeDropdown' onClick={handleMoreInfClick}>
        </div>
      <nav className='navbar-' >

        <div className='logo-minsize'>
          <h1>
          <img src="src/assets/pingpong.png" />
          PingPong</h1>
        </div>

        <ul>
          <div className='logo-search'>
            <li>
              <h1>
              <img src="src/assets/pingpong.png"/>
              PingPong</h1>
            </li>
            <li>
              <input 
              type="text"
              placeholder="Search..."
              className='navbar-search'
              // value={searchQuery}
              // onChange={handleSearch}
              />
            </li>
          </div>

          <div className='middle-navbar'>
            <li><Link to="/game">Game</Link></li>
            <li><a>Home</a></li>
            <li><Link to="/chat">Chat</Link></li>
          </div>

          <div className='middle-navbar-hamburger'>
            <li onClick={handleMoreInfClick}><img src='src/assets/Hamburger-Menu.svg'/></li>
          </div>

          <div className='profile-exit'>
            <li><Link to="/profile"><img src="https://thispersondoesnotexist.com" className='profile-button-navbar'/></Link></li>
            <li onClick={handleLogout}><img src='src/assets/exit.svg' /></li>
          </div>
          
        </ul>

      </nav>
    </>
  );
};

export default NavBar;
