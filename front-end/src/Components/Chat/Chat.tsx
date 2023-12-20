import React, { useEffect, useState, useCallback} from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import PopupCreatGroup from './PopupCreatGroup';
import PopupGroupInf from './PopupGroupInf';
import './chat.css';
import io from 'socket.io-client';

const Chat = () => {

  const [chatDivShow,setShow]:any = useState(2);

  const [popupParent, setPopupParent] = useState({display:'none'});
  const [popupInfParent, setPopupInfParent] = useState({display:'none'});
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0, display: 'none', i: 0});


    const escFunction = useCallback((event:any) => {
    if (event.key === "Escape") 
    {
      setPopupParent((prev:any)=> {
        return ({...prev,display:'none'})
      });

      setPopupInfParent((prev:any)=> {
        return ({...prev,display:'none'})
      });
      setDivPosition((prev:any)=> {
          return{...prev, display: 'none', i: '0'}
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);


  useEffect(()=>{
    function handleResize(){
      if (innerWidth >=925)
        setShow(2);
    }

    window.addEventListener('load', handleResize);
    window.addEventListener("resize",handleResize);

    // this is socket start here 

      // Replace 'http://localhost:3000' with the actual URL of your Socket.IO server
      const socket = io('http://localhost:3000');
  
      // Connect event
      socket.on('connect', () => {
        console.log('Connected to server from front');
      });
  
      // Listen for DirectMessage event
      socket.on('DirectMessage', (message) => {
        console.log('Received DirectMessage:', message);
        // Handle the received message in your React component state or dispatch it to Redux, etc.
      });
  
      // Handle disconnect event
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
  
      // Handle any errors
      socket.on('error', (error) => {
        console.error('Socket.IO Error:', error);
      });
  
      // Cleanup the socket connection on component unmount
      return () => {
        console.log("disconnected from socket in front ")
        socket.disconnect();
      };



  },[]);

  return (
    <div className='chat'>
        <div className='page-chats'>
            {(chatDivShow == 2) ? 
              <>
                <ChatList setShow={setShow} setPopupParent={setPopupParent}  />
                <ChatContainer setShow={setShow} setPopupInfParent={setPopupInfParent} />
              </>
              : (chatDivShow)?
                  <ChatList setShow={setShow} setPopupParent={setPopupParent}  />
                  :
                  <ChatContainer setShow={setShow} setPopupInfParent={setPopupInfParent} />
            }
        </div>
        <PopupCreatGroup setPopupParent={setPopupParent}  popupParent={popupParent}/>
        <PopupGroupInf setPopupInfParent={setPopupInfParent}  popupInfParent={popupInfParent}
          divPosition={divPosition} setDivPosition={setDivPosition}/>
    </div>
  );
};

export default Chat;
