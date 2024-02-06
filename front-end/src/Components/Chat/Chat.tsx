// @ts-ignore
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

  const {refresh, setRefresh, authUser, socketRef, convInf, setConvInf }: any = useAuth();
  const [chatDivShow, setShow]: any = useState((innerWidth >= 925) ? 2 : 1);
  const [RoomId, setRoomID] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifAlert, setNotifAlert] = useState({ error: '', msg: '' });
  const [newMessage, setNewMessage] = useState({});
  const [usersStatus, setUsersStatus] = useState(new Map());
  
  const [popupParent, setPopupParent] = useState({ display: 'none' });
  const [popupInfParent, setPopupInfParent] = useState({ display: 'none' });
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0, display: 'none', i: 0 });

  const selectedConvRef = useRef(convInf);
  
  useEffect(() => {
    selectedConvRef.current = convInf;
  }, [convInf]);


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
        if (authUser.blockList.indexOf(data?.Id) === -1 && authUser?.userId !== data?.Id && selectedConvRef.current.convId == data.convId) {
          setNewMessage({
            Name: data.name,
            Message: data.Message,
            user: (authUser.userId === data.Id) ? 'user' : 'is-not-user',
            Avatar: data.Avatar,
            Id: data.Id,
          });
        }

      });

      socketRef.current.on('status', (data: any) => {
        setRefresh(2);
        setUsersStatus(usersStatus.set(data.userId, data.status))
        setUsersStatus(usersStatus.set(4, data.status))
        console.log("status change", data, data.userId, data.status, "***", usersStatus)
      })


    }

    return () => {
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 925) {
        setShow(2);
      } else if (window.innerWidth < 925 && chatDivShow !== 0) {
        setShow(1);
      }
    }
    handleResize();
  
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chatDivShow]);

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
            <ChatContainer usersStatus={usersStatus} newMessage={newMessage} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} setPopupInfParent={setPopupInfParent} />
          </>
          : (chatDivShow) ?
            <ChatList usersStatus={usersStatus} setUsersStatus={setUsersStatus} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} convInf={convInf} setConvInf={setConvInf} refresh={refresh} setRefresh={setRefresh} setPopupParent={setPopupParent} />
            :
            <ChatContainer usersStatus={usersStatus} newMessage={newMessage} setShowDropdown={setShowDropdown} setNotifAlert={setNotifAlert} setShow={setShow} socket={socketRef} refresh={refresh} setRefresh={setRefresh} setPopupInfParent={setPopupInfParent} />
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
