import React, { useState } from 'react'
import './chat.css';


const ChatHeader = () => {
  
  return (
      <div className='chat-header'>
          <div className='chat-info'>
            <img src='https://thispersondoesnotexist.com/' className='conversation-avatar'/>
            <div className='content'>
                <h5>1Lorem Ipsom</h5>
                <p>online</p>
            </div>
          </div>
        <div className='play-button-chat'>
            <p>Play Now</p>
        </div>
      </div>
  );
};

export default ChatHeader;
