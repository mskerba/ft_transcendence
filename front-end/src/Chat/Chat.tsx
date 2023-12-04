import React, { useEffect, useState } from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import './chat.css';


const Chat = () => {
  const [chatDivShow,setShow]:any = useState(2);

  useEffect(()=>{
    function handleResize(){
      if (innerWidth >=925)
        setShow(2);
    }

    window.addEventListener('load', handleResize);
    window.addEventListener("resize",handleResize);
  },[]);

  return (
    <div className='chat'>
        <div className='page-chats'>
            {(chatDivShow == 2) ? 
              <>
                <ChatList setShow={setShow}/>
                <ChatContainer setShow={setShow}/>
              </>
              : (chatDivShow)?
                  <ChatList setShow={setShow}/>
                  :
                  <ChatContainer setShow={setShow}/>
            }
        </div>
    </div>
  );
};

export default Chat;
