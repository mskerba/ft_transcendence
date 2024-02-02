import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import Message from './Message';
import { useAuth } from '../../context/AuthContext';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import io from 'socket.io-client';
import './chat.css';

const ChatContainer = (prop:any) => {

  const { authUser }: any = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState('');

  const [allMessage, setAllMessage] = useState([
  ]);

  const handleMessageChange = (event:any) => {
    setMessage(event.target.value);
  };


  const fetchData = async () => {
    try {
      const res = await axiosPrivate.get(`/chat${(prop.convInf.group)?'/group':''}/${prop.convInf.convId}`);
      setAllMessage([]);
      console.log("refresh")
      const messages = Object.values(res?.data).map((element:any) => {
        const user = (element.Id === authUser.userId) ? 'user' : 'is-not-user';
        return { ...element, user };
      });
      
      setAllMessage((prev) => [...prev, ...messages]);
      
    } catch (error) { 
      prop.setShowDropdown(true);
      setTimeout(()=>prop.setShowDropdown(false), 3000);
      // prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
      
    }
  };
  
  useEffect(() => {
    fetchData();
    // prop.setRefresh(0);
  }, [prop.convInf]);
  
  useEffect(()=>{
    console.log(prop.newMessage);
    setAllMessage([ prop.newMessage, ...allMessage]);
  },[prop.newMessage])
  
  const handleSendMessage = () => {
    if (message == '')
    return;
    if (prop.convInf.group){
      console.log(prop);

      prop.socket.current.emit('seen', { convId:  prop.convInf.convId, isGroup: true });
      prop.socket.current.emit('messageTogroup', {group: prop.convInf.convId, message:message});
    }
    else {
      prop.socket.current.emit('seen', { convId:  prop.convInf.convId, isGroup: false });
      prop.socket.current.emit('DirectMessage', {to: prop.convInf.Name, msg:message,Unseen: 3});

    }
    prop.setRefresh(2);
    const newMessage = { name: 'New User', Message: message, user: 'user' };
    setAllMessage([ newMessage, ...allMessage]);
    setMessage('');
  };

  return (
    <div className='chat-container'>
      { (prop.convInf.convId !== "") && <>

        <ChatHeader  usersStatus={prop.usersStatus} setShow={prop.setShow} convInf={prop.convInf} setPopupInfParent={prop.setPopupInfParent} />

        <div className='chat-conversation'>
          <div className='child-chat-conversation'>
            {allMessage.reverse().map((element, index) => (
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
