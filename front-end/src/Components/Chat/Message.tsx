import React, { useEffect, useState } from 'react';
import './chat.css';

function Message(props:any) {
  const { user, Name, Message, group, Avatar} = props;
  const channel = group;

  return (
    <div className='chat-messages'>
      <div className={user}>
        {channel && user !== 'user' && <img src={`http://localhost:3000/avatar/${Avatar}`} alt='User avatar' />}
        <div className={`color-${user}`}>
          {channel && user !== 'user' && <h4>{Name}</h4>}
          <p>{Message}</p>
        </div>
      </div>
    </div>
  );
}



export default Message;
