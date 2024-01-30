import React, { useEffect, useState, useCallback, useRef } from 'react'
import ChatList from './ChatList';
import ChatContainer from './ChatContainer'
import PopupCreatGroup from './PopupCreatGroup';
import PopupGroupInf from './PopupGroupInf';
import io from 'socket.io-client';
import { Alert, AlertTitle } from '@mui/material';
import './chat.css';
import { useAuth } from '../../context/AuthContext';


const Chat = () => {

  const { authUser, socketRef, convInf, setConvInf }: any = useAuth();
  const [chatDivShow, setShow]: any = useState(2);
  const [RoomId, setRoomID] = useState('')
  const [refresh, setRefresh] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifAlert, setNotifAlert] = useState({ error: '', msg: '' });
  const [newMessage, setNewMessage] = useState({});
  const [usersStatus, setUsersStatus] = useState(new Map([]))

  const [popupParent, setPopupParent] = useState({ display: 'none' });
  const [popupInfParent, setPopupInfParent] = useState({ display: 'none' });
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0, display: 'none', i: 0 });




  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      setPopupParent((prev: any) => {
        return ({ ...prev, display: 'none' })
      });


      setPopupInfParent((prev: any) => {
        return ({ ...prev, display: 'none' })
      });
      setDivPosition((prev: any) => {
        return { ...prev, display: 'none', i: '0' }
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
    if (socketRef.current !== null) {

      socketRef.current.on('FrontDirectMessage', (data: any) => {
        setRefresh(2);
        setNewMessage({
          name: 'New User',
          Message: data.Message,
          user: (authUser.userId === data.userId) ? 'user' : 'is-not-user',
          Avatar: data.Avatar,
        });

      })

      socketRef.current.on('status', (data: any) => {
        const updatedMap = new Map(usersStatus);
        if (updatedMap.has(data.id)) {
          updatedMap.set(data.id, data.status);
          setUsersStatus(updatedMap);
        }
      })


    }

    return () => {
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (innerWidth >= 925)
        setShow(2);
      else
        setShow(1)
    }

    window.addEventListener('load', handleResize);
    window.addEventListener("resize", handleResize);
  }, [window]);

  return (
    <div className='chat'>

      {showDropdown &&
        <Alert variant="filled" severity={notifAlert.error} style={{ position: 'absolute' }}>
          {notifAlert.msg}
        </Alert>
      }
      <div className='page-chats'>
        {(chatDivShow == 2) ?
          <>
            <ChatList usersStatus={usersStatus} setUsersStatus={setUsersStatus} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} convInf={convInf} setConvInf={setConvInf} refresh={refresh} setRefresh={setRefresh} setPopupParent={setPopupParent} />
            <ChatContainer usersStatus={usersStatus} newMessage={newMessage} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} convInf={convInf} setPopupInfParent={setPopupInfParent} />
          </>
          : (chatDivShow) ?
            <ChatList usersStatus={usersStatus} setUsersStatus={setUsersStatus} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} convInf={convInf} setConvInf={setConvInf} refresh={refresh} setRefresh={setRefresh} setPopupParent={setPopupParent} />
            :
            <ChatContainer usersStatus={usersStatus} newMessage={newMessage} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} convInf={convInf} setPopupInfParent={setPopupInfParent} />
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
