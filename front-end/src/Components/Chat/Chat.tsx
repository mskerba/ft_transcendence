import React, { useEffect, useState, useCallback} from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import Popup from './Popup';
import './chat.css';


const Chat = () => {
  const [chatDivShow,setShow]:any = useState(2);

  const [popupParent, setPopupParent] = useState({display:'none'});

    const escFunction = useCallback((event:any) => {
    if (event.key === "Escape") 
      setPopupParent((prev:any)=> {
        return ({...prev,display:'none'})
    });
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
  },[]);

  return (
    <div className='chat'>
        <div className='page-chats'>
            {(chatDivShow == 2) ? 
              <>
                <ChatList setShow={setShow} setPopupParent={setPopupParent}  />
                <ChatContainer setShow={setShow}/>
              </>
              : (chatDivShow)?
                  <ChatList setShow={setShow} setPopupParent={setPopupParent}  />
                  :
                  <ChatContainer setShow={setShow}/>
            }
        </div>
        <Popup setPopupParent={setPopupParent}  popupParent={popupParent}/>
    </div>
  );
};

export default Chat;
