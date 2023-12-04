import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import './chat.css';


const ChatContainer = ({setShow}:any) => {
  
  return (
    <div className='chat-container'>

      <ChatHeader setShow={setShow}/>

      <div  className='chat-conversation'>
      </div>

      <div  className='chat-input'>
        <div className='input-content'>
          <input type='text' placeholder='Message' className='input-message'/>
          <div className='message-send'>
            <img src="src/assets/send.svg" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatContainer;
