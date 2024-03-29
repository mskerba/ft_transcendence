// @ts-ignore
import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import Message from './Message';
import { useAuth } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import io from 'socket.io-client';
import './chat.css';

const ChatContainer = (prop: any) => {

  const { authUser, convInf, socketRef }: any = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState('');

  const [allMessage, setAllMessage] = useState([
  ]);

  const handleMessageChange = (event: any) => {
    setMessage(event.target.value);
  };


  const fetchData = async () => {
    try {
      const res = await axiosPrivate.get(`/chat${(convInf.group) ? '/group' : ''}/${convInf.convId}`);
      setAllMessage([]);
      console.log("refresh")
      const messages = Object.values(res?.data).map((element: any) => {
        const user = (element.Id === authUser.userId) ? 'user' : 'is-not-user';
        return { ...element, user };
      });

      setAllMessage((prev) => [...prev, ...messages]);

    } catch (error) {
      prop.setShowDropdown(true);
      setTimeout(() => prop.setShowDropdown(false), 3000);
      // prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})

    }
  };

  useEffect(() => {
    fetchData();
    // prop.setRefresh(0);
  }, [convInf]);

  useEffect(() => {
    // console.log(prop.newMessage);
    // if (socketRef !== null) {
    //   if (convInf.group)
    //     socketRef.current.emit('seen', { convId:  convInf.convId, isGroup: true });
    //   else
    //     socketRef.current.emit('seen', { convId:  convInf.convId, isGroup: false });
    // }

    setAllMessage([prop.newMessage, ...allMessage]);
  }, [prop.newMessage])

  const handleSendMessage = () => {
    let trimMsg =message.trim(); 
    setMessage(trimMsg);
    if (trimMsg == '')
      return;
    if (convInf.group) {
      socketRef.current.emit('seen', { convId: convInf.convId, isGroup: true });
      socketRef.current.emit('messageTogroup', { group: convInf.convId, message: message });
    }
    else {
      socketRef.current.emit('seen', { convId: convInf.convId, isGroup: false });
      socketRef.current.emit('DirectMessage', { to: convInf.Name, msg: message, Unseen: 3 });

    }
    prop.setRefresh(2);
    setMessage('');
  };

  return (
    <div className='chat-container'>
      {(convInf.convId !== "") && <>

        <ChatHeader usersStatus={prop.usersStatus} setShow={prop.setShow} setPopupInfParent={prop.setPopupInfParent} setRefresh={prop.setRefresh} refresh={prop.refresh} />

        <div className='chat-conversation'>
          <div className='child-chat-conversation'>
            {allMessage.reverse().map((element, index) => (
              <Message key={index} {...element} group={convInf.group} />
            ))}
          </div>
        </div>

        <div className='chat-input'>
          <div className='input-content'>
            <textarea
              placeholder='Message'
              className='input-message'
              value={message}
              onChange={handleMessageChange}
            ></textarea>
            <div className='message-send'>
              <img src="/src/assets/send.svg" onClick={handleSendMessage} />
            </div>
          </div>
        </div>
      </>}
    </div>
  );
};

export default ChatContainer;
