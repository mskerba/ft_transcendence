import React, { useState } from 'react'
import './chat.css';


const ChatHeader = (prop:any) => {
  const group:Boolean = true;

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
            <img src='https://thispersondoesnotexist.com/' className='conversation-avatar'/>
            <div className='content'>
                <h5>abdelmounim skerbaabdelmounim sk</h5>
                <p>online</p>
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
