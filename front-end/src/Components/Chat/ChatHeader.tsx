import React, { useEffect, useState } from 'react'
import './chat.css';
import { useAuth } from '../../context/AuthContext';


const ChatHeader = (prop:any) => {
  const { convInf}: any = useAuth();
  const group:Boolean = convInf.group;
  const [status, setStatus] = useState(prop.usersStatus.get(convInf.id)); 

  useEffect(()=>{
    setStatus(prop.usersStatus.get(convInf.id));
    console.log("FSFSDFDSFDS")
  }, [prop.usersStatus.get(convInf.id)]);

  function handelClick() {
    if (innerWidth <925)
      prop.setShow(1);
  }

  function handelClickInf() {
    prop.setPopupInfParent((prev:any)=> {
      return ({...prev,display:'flex'})
    });
  }

  return (
      <div className='chat-header'>
        <div className='side-bar-controle-button' onClick={handelClick}>
          <img src='/src/assets/arrow.svg' className='arrow-svg'/>
        </div>
        <div className='right-part-header'>
          <a  href={`/user/${convInf.Id}`}>
            <div className='chat-info'>
              <img src={`http://localhost:3000/avatar/${convInf.Avatar}`} className='conversation-avatar'/>
              <div className='content'>
                  <h5>{convInf.Name}</h5>
                  {!group && <p>{status}</p>}
              </div>
            </div>
          </a>
          {group && <div  className='info-group-button' onClick={handelClickInf} ><img src='/src/assets/info-group.svg'/></div>}
          {!group && <div className='play-button-chat'>
              <p>Play Now</p>
              <img src='/src/assets/play-now.svg' />
          </div>}
        </div>
      </div>
  );
};

export default ChatHeader;
