import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import io from 'socket.io-client';

import './chat.css';

function Message(props:any) {
  const { user, name, message } = props;
  const channel = true;

  return (
    <div className='chat-messages'>
      <div className={user}>
        {channel && user !== 'user' && <img src='https://placekitten.com/50/50' alt='User avatar' />}
        <div className={`color-${user}`}>
          {channel && user !== 'user' && <h4>{name}</h4>}
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

// get message here using axios
const ChatContainer = (props:any) => {
  const [message, setMessage] = useState('');

  const [allMessage, setAllMessage] = useState([
    { name: 'abdelmounaim Skerba', message: "sbab3 kaysefet message", user: 'is-not-user' },
    { name: 'taha meaizi', message: "sf stafit jaya", user: 'is-not-user' },
    { name: 'imad harile', message: "taha ghadi imout", user: 'user' },
  ]);

  const handleMessageChange = (event:any) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message == '')
      return;
    const newMessage = { name: 'New User', message, user: 'user' };
    setAllMessage([ newMessage, ...allMessage]);
    setMessage('');
  };

  return (
    <div className='chat-container'>
      <ChatHeader setShow={props.setShow} setPopupInfParent={props.setPopupInfParent} />

      <div className='chat-conversation'>
        <div className='child-chat-conversation'>
          {allMessage.map((element, index) => (
            <Message key={index} {...element} />
          ))}
        </div>
      </div>

      <div className='chat-input'>
        <div className='input-content'>
          <textarea
            placeholder='Message'
            className='input-message'
            value={message}
            onChange={handleMessageChange}
          ></textarea>
          <div className='message-send'>
            <img src="src/assets/send.svg" onClick={handleSendMessage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
