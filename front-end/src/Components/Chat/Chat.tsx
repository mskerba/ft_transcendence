import React, { useEffect, useState, useCallback, useRef} from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import PopupCreatGroup from './PopupCreatGroup';
import PopupGroupInf from './PopupGroupInf';
import io from 'socket.io-client';
import { Alert, AlertTitle } from '@mui/material';
import './chat.css';


const Chat = () => {

  const socketRef = useRef(null);
  const [chatDivShow,setShow]:any = useState(2);
  const [RoomId, setRoomID] = useState('')
  const [refresh,setRefresh] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifAlert, setNotifAlert] = useState({error:'',msg:'' });
  const [convInf, setConvInf]:any = useState({
    Avatar : "",
    Name: "",
    convId : "",
    group: ""
  })

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

  useEffect(() => {
    // Only create the socket once
    if (socketRef.current === null) {
      socketRef.current = io('http://localhost:3000', {
        transports: ["websocket"],
        withCredentials: true,
      });


      socketRef.current.emit('UserID', {userId: 0}); 
    
      socketRef.current.on('FrontDirectMessage', (data:any) => {
        console.log("DFSDF",data)
      })

    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); 

  useEffect(()=>{
    function handleResize(){
      if (innerWidth >=925)
        setShow(2);
      else
        setShow(1)
    }

    window.addEventListener('load', handleResize);
    window.addEventListener("resize",handleResize);
  },[window]);
  
  return (
    <div className='chat'>

        { showDropdown && 
          <Alert variant="filled" severity={notifAlert.error} style={{position: 'absolute'}}>
            {notifAlert.msg}
          </Alert>
        }
        <div className='page-chats'>
            {(chatDivShow == 2) ? 
              <>
                <ChatList setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} setConvInf={setConvInf} refresh={refresh} setRefresh={setRefresh}  setPopupParent={setPopupParent}  />
                <ChatContainer setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} convInf={convInf} setPopupInfParent={setPopupInfParent} />
              </>
              : (chatDivShow)?
                  <ChatList setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} setConvInf={setConvInf} refresh={refresh} setRefresh={setRefresh} setPopupParent={setPopupParent}  />
                  :
                  <ChatContainer setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} convInf={convInf} setPopupInfParent={setPopupInfParent} />
            }
        </div>
        <PopupCreatGroup 
          setPopupParent={setPopupParent}  
          popupParent={popupParent}
          RoomId={RoomId}
          setRoomID={setRoomID}
          setRefresh={setRefresh}
          setShowDropdown={setShowDropdown}
          setNotifAlert={setNotifAlert}
          />

        <PopupGroupInf
          setRefresh={setRefresh}
          refresh={refresh}
          convInf={convInf}
          setShow={setShow}
          setConvInf={setConvInf}
          setPopupParent={setPopupParent}
          setPopupInfParent={setPopupInfParent}  
          popupInfParent={popupInfParent}
          divPosition={divPosition} setDivPosition={setDivPosition}
          setRoomID={setRoomID}
          setShowDropdown={setShowDropdown}
          setNotifAlert={setNotifAlert} />
    </div>
  );
};

export default Chat;
