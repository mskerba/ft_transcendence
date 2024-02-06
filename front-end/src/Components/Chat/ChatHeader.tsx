// @ts-ignore
import React, { useEffect, useState } from 'react'
import './chat.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';


const ChatHeader = (prop: any) => {
  const { convInf, setRandomKey, socketRef }: any = useAuth();
  const group: Boolean = convInf.group;
  const [status, setStatus] = useState(prop.usersStatus.get(convInf.Id));
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let userId = (typeof convInf.Id == 'string')?parseInt(convInf.Id):convInf.Id;
    setStatus(prop.usersStatus.get(userId));
    prop.setRefresh(0)
  }, [prop.refresh, prop.usersStatus.get(convInf.Id)]);

  useEffect(() => {
    console.log("!!!!!>>>>>", status, " " , convInf.status);
    if (convInf.status)
      setStatus(convInf.status);
  }, [])


  function handelClick() {
    if (innerWidth < 925)
      prop.setShow(1);
  }

  function handelClickInf() {
    prop.setPopupInfParent((prev: any) => {
      return ({ ...prev, display: 'flex' })
    });
  }

  const handlePlayFreindClick = (userId: number) => {
    const prefix = 'privateGame_';
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 8); // Adjust the length as needed
    const generatedName = `${prefix}${timestamp}_${randomPart}`;

    setRandomKey(generatedName);
    socketRef.current.emit("createPrivateGame", { userId, gameID: generatedName })
    navigate('/game');
  }

  return (
    <div className='chat-header'>
      <div className='side-bar-controle-button' onClick={handelClick}>
        <img src='/src/assets/arrow.svg' className='arrow-svg' />
      </div>

      <div className='right-part-header'>
        {!convInf.group && <Link to={`/user/${convInf.Id}`}>
          <div className='chat-info'>
            <img src={`http://localhost:3000/avatar/${convInf.Avatar}`} className='conversation-avatar' />
            <div className='content'>
              <h5>{convInf.Name}</h5>
              {!group && <p>{status}</p>}
            </div>
          </div>
        </Link>}
        {convInf.group &&
          <div className='chat-info'>
            <img src={`http://localhost:3000/avatar/${convInf.Avatar}`} className='conversation-avatar' />
            <div className='content'>
              <h5>{convInf.Name}</h5>
              {!group && <p>{status}</p>}
            </div>
          </div>}

        {group && <div className='info-group-button' onClick={handelClickInf} ><img src='/src/assets/info-group.svg' /></div>}
        {!group && <div className='play-button-chat' onClick={() => handlePlayFreindClick(convInf.Id)}>
          <p>Play Now</p>
          <img src='/src/assets/play-now.svg' />
        </div>}
      </div>

    </div>
  );
};

export default ChatHeader;
