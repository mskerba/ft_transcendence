import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import Message from './Message';
import { useAuth } from '../../context/AuthContext';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import io from 'socket.io-client';
import './chat.css';

const ChatContainer = (prop:any) => {

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState('');

  const [allMessage, setAllMessage] = useState([
  ]);

  const handleMessageChange = (event:any) => {
    setMessage(event.target.value);
  };


  const fetchData = async () => {
    try {
      const res = await axiosPrivate.get(`/chat${(prop.convInf.group)?'/group':''}/0/${prop.convInf.convId}`);
      setAllMessage([]);
      const messages = Object.values(res?.data).map((element:any) => {
        const user = (element.Id === 0) ? 'user' : 'is-not-user';
        return { ...element, user };
      });
  
      setAllMessage((prev) => [...prev, ...messages]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
    console.log(allMessage)
  }, [prop]);
  

  const handleSendMessage = () => {
    if (message == '')
      return;
    const newMessage = { name: 'New User', Message : message, user: 'user' };
    setAllMessage([ newMessage, ...allMessage]);
    setMessage('');
  };

  return (
    <div className='chat-container'>
      { (prop.convInf.convId !== "") && <>

        <ChatHeader setShow={prop.setShow} convInf={prop.convInf} setPopupInfParent={prop.setPopupInfParent} />

        <div className='chat-conversation'>
          <div className='child-chat-conversation'>
            {allMessage.map((element, index) => (
              <Message key={index} {...element} group={prop.convInf.group}/>
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
              <img src="/src/assets/send.svg" onClick={handleSendMessage}/>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
};

export default ChatContainer;
