import React, { useEffect, useState } from 'react';
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



export default Message;
