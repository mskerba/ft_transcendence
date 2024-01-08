import React, { useEffect, useState } from 'react'
import './chat.css';


const ChatHeader = (prop:any) => {
  const group:Boolean = prop.convInf.group;



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
          <div className='chat-info'>
            <img src={`http://localhost:3000/avatar/${prop.convInf.Avatar}`} className='conversation-avatar'/>
            <div className='content'>
                <h5>{prop.convInf.Name}</h5>
                {!group && <p>{prop.usersStatus.get(prop.convInf.id)}</p>}
            </div>
          </div>
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
