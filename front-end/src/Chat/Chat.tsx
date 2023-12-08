import React, { useEffect, useState, useCallback} from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import PopupCreatGroup from './PopupCreatGroup';
import PopupGroupInf from './PopupGroupInf';
import './chat.css';


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
