import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import './chat.css';

function Message(prop:any) {
  return (

    <div  className='chat-messages'>
      <div className={prop.user}>
        <div className={`color-${prop.user}`}>
          <p>sdflkdsjfdslkdfsd</p>
        </div>
      </div>
    </div>
  );
}


const ChatContainer = (prop:any) => {
  
  return (
    <div className='chat-container'>

      <ChatHeader setShow={prop.setShow} setPopupInfParent={prop.setPopupInfParent}/>

      <div  className='chat-conversation'>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>`
          <Message user={'user'}/>`
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
          <Message user={'user'}/>
          <Message user={'is-not-user'}/>
      </div>

      <div  className='chat-input'>
        <div className='input-content'>
          {/* <input type='stylesheet' placeholder='Message' className='input-message'/> */}
          <textarea placeholder='Message' className='input-message' ></textarea>
          <div className='message-send'>
            <img src="src/assets/send.svg" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatContainer;
