import React, { useState, useEffect } from 'react'
import './navBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';


const NavBar = () => {

  const [divPosition, setDivPosition]: any = useState({
    x: 0,
    y: 0,
    display: 'none',
  })

  function handleMoreInfClick(event: any) {
    const { clientX, clientY } = event;
    setDivPosition((prev: any) => {
      let display = (prev.display == 'none') ? 'flex' : 'none';
      return {
        x: `${clientX}px`,
        y: `${clientY}px`,
        display: display,
      }
    });
  }

  const { authUser, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [result, setResult] = useState([]);
  const navigate = useNavigate();


  const handleLogout = async () => {

    try {
      await axiosPrivate.get('auth/logout');
      logout();
    } catch (errot) { }

  }

  const handleInputChange = async (e: any) => {
    setSearchQuery(e.target.value);

    if (e.target.value.length === 0) {
      setResult([]);
      return;
    }

    try {
      const res = await axiosPrivate.get(`/search?keyword=${encodeURIComponent(e.target.value)}`);

      setResult(res.data);
    } catch (error) { }

  };


  return (
    <>
      <div style={{ top: divPosition.x, left: divPosition.y, display: divPosition.display }} className='dropdown-navbar-ham'>
        <ul>
          <li><Link to="/game" className="link">Game</Link></li>
          <li><Link to="/leaderboard" className="link">Leaderboard</Link></li>
          <li><Link to="/chat" className="link">Chat</Link></li>
          <div className='dropdown-ham-profile'>
            <li><Link to={`/user/${authUser.userId}`} className="link">Profile</Link></li>
            <li onClick={handleLogout} >Exit</li>
          </div>
        </ul>
      </div>

      <div style={{ display: divPosition.display }} className='closeDropdown' onClick={handleMoreInfClick}>
      </div>

      <nav className='navbar-' >

        <div className='logo-minsize'>
          <h1>
            <img src="/src/assets/pingpong.png" className='logo-image' />
            PongGreen</h1>
        </div>

        <ul>
          <div className='logo-search'>
            <li>
              <h1>
                <img src="/src/assets/pingpong.png" className='logo-image' />
                PongGreen
              </h1>
            </li>
            <li>
              <input
                type="text"
                placeholder="Search..."
                className='navbar-search'
                value={searchQuery}
                onChange={handleInputChange}
              />
            </li>
          </div>

          <div className='middle-navbar'>
            <li><Link to="/game" className="link">Game</Link></li>
            <li><Link to="/leaderboard" className="link">Leaderboard</Link></li>
            <li><Link to="/chat" className="link">Chat</Link></li>
          </div>

          <div className='middle-navbar-hamburger'>
            <li onClick={handleMoreInfClick}><img src='/src/assets/Hamburger-Menu.svg' className='hamburger-svg' /></li>
          </div>

          <div className='profile-exit'>
            <li>
              <Link to={`/user/${authUser.userId}`} className="link">
                <img src={`http://localhost:3000/avatar/${authUser.avatar}`} className='profile-button-navbar' />
              </Link>
            </li>
            <li onClick={handleLogout}><img src='/src/assets/exit.svg' className='exit-svg' /></li>
          </div>

        </ul>

      </nav>

      {result.length > 0 &&
        <div className='search-result'>
          {result.map((e) => (

            (e.userId) ?
              <h3
                onClick={() => {
                  setSearchQuery('');
                  setResult([]);
                  navigate(`/user/${e.userId}`);
                }}
              >
                {e.name}
              </h3>
              : <h3>{e.title}</h3>

          ))}

        </div>
      }
    </>
  );
};

export default NavBar;
