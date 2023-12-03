import React, { useState } from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import './chat.css';


const Chat = () => {
  
  return (
    <div className='chat'>
        <div className='page-chats'>
            <ChatList />
            <ChatConchattainer />
        </div>
    </div>
  );
};

export default Chat;
