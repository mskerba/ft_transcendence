// @ts-ignore
import React, { useState, useEffect } from 'react'
import './navBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import Modal from 'react-modal';
import { toast } from 'react-toastify';


const NavBar = () => {

  const [divPosition, setDivPosition]: any = useState({
    x: 0,
    y: 0,
    display: 'none',
  })

  function handleMoreInfClick(event: any) {
    setRefresh(2)
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

  const {setRefresh,  authUser, logout, setConvInf, socketRef } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<any>({});
  const [insertPassord, setInsertPassord] = useState<boolean>(false);
  const [result, setResult] = useState([]);
  const navigate = useNavigate();


  const handleJoinGroup = async (group: any) => {


    try {
      const res = await axiosPrivate.post('/chat/group/join', {
        roomId: group.RoomId,
        password: password,
      });

      if (res.data.success) {
        socketRef.current.emit('addToGroup', { name: authUser.name, roomId: group.RoomId });
        setConvInf({
          Avatar: group.avatar,
          Name: group.title,
          convId: group.RoomId,
          group: true,
        });
        setSearchQuery('');
        setResult([]);
        navigate('/chat');
      }
      else {
        toast.error(res?.data?.error);
        
      }
    } catch (error) { console.log(error) }

    setPassword('');

  }


  const handleNavigateToProfile = (userId: number) => {

    setSearchQuery('');
    setResult([]);
    navigate(`/user/${userId}`);

  }

  const handleLogout = async () => {

    try {
      await axiosPrivate.get('auth/logout');
      logout();
    } catch (errot) { }

  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
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
      console.log(res.data);
    } catch (error) { }

  };

  function closeInsertPassword() {
    setInsertPassord(false);
    setPassword('');
  }


  useEffect(() => {
    function handleResize() {
      setDivPosition((prev: any) => {
        return {
          ...prev,
          x: '0px',
          y: '0px',
          display: 'none',
        }
      });
    }
  
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toHome = () => navigate('/');


  return (
    <>
      <div style={{ top: divPosition.x, left: divPosition.y, display: divPosition.display }} className='dropdown-navbar-ham'>
        <ul>
          <li onClick={handleMoreInfClick} ><Link to="/" className="link">Home</Link></li>
          <li onClick={handleMoreInfClick} ><Link to="/leaderboard" className="link">Leaderboard</Link></li>
          <li onClick={handleMoreInfClick} ><Link to="/chat" className="link">Chat</Link></li>
          <div className='dropdown-ham-profile'>
            <li><Link to={`/user/${authUser.userId}`} className="link">Profile</Link></li>
            <li onClick={handleLogout} >Exit</li>
          </div>
        </ul>
      </div>

      <div style={{ display: divPosition.display }} className='closeDropdown' onClick={handleMoreInfClick}>
      </div>

      <nav className='navbar-' >

        <div className='logo-minsize' onClick={toHome}>
          <h1>
            <img src="/src/assets/pingpong.png" className='logo-image' />
            PongGreen</h1>
        </div>

        <ul>
          <div className='logo-search'>
            <li onClick={toHome}>
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
            <li onClick={()=>setRefresh(2)}><Link to="/" className="link">Home</Link></li>
            <li onClick={()=>setRefresh(2)}><Link to="/leaderboard" className="link">Leaderboard</Link></li>
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
          {result.map((e: any, i) => (


            (e.userId) ?
              <div className='result-item' key={i}
                onClick={() => {
                  handleNavigateToProfile(e.userId);
                }}
              >
                <img src={`http://localhost:3000/avatar/${e.avatar}`} className='profile-button-navbar' />
                <h3>
                  {e.name}
                </h3>
              </div>
              : <div className='result-item' key={i}
                onClick={() => {
                  if (e.TypeRoom === 'protected') {
                    setInsertPassord(true);
                    setSelectedRoom(e);
                  }
                  else {
                    handleJoinGroup(e);
                  }
                }}
              >
                <img src={`http://localhost:3000/avatar/${e.avatar}`} className='profile-button-navbar' />
                <h3>{e.title}</h3>
              </div>

          ))}
        </div>
      }
      <Modal
        isOpen={insertPassord}
        className='update-group-popup'
        onRequestClose={closeInsertPassword}
      >
        <h4>username:</h4>
        <input
          type='password'
          placeholder='password'
          className='update-group-input'
          value={password}
          onChange={handlePasswordChange}
        />
        <input type='submit' className='submit-add-group' onClick={() => {
          handleJoinGroup(selectedRoom);
          setInsertPassord(false);
        }}
        />
      </Modal>
    </>
  );
};

export default NavBar;
