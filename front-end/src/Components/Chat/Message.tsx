// @ts-ignore
import React, { useEffect, useState } from 'react';
import './chat.css';

function Message(props:any) {
  const { user, Name, Message, group, Avatar, Id} = props;
  const channel = group;

  return (
    <div className='chat-messages'>
      <div className={user}>
        
        <a  href={`/user/${Id}`}>
          {channel && Avatar !== undefined && user !== 'user' && <img src={`http://localhost:3000/avatar/${Avatar}`} alt='User avatar' />}
        </a>
        <div className={`color-${user}`}>
          <a  href={`/user/${Id}`}>
            {channel && user !== 'user' && <h4>{Name}</h4>}
          </a>
          <p>{Message}</p>
        </div>
      </div>
    </div>
  );
}



export default Message;
