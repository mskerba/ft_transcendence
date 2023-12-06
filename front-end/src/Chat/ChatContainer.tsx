import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import './chat.css';

function Message(prop:any) {
  return (

    <div  className='chat-messages'>
      <div className={prop.user}>
        <div className={`color-${prop.user}`}>
          <p>gafsdfsdfsd</p>
        </div>
      </div>
    </div>
  );
}


const ChatContainer = ({setShow}:any) => {
  
  return (
    <div className='chat-container'>

      <ChatHeader setShow={setShow}/>

      <div  className='chat-conversation'>
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
