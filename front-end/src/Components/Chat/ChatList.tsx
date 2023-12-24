import React, { useState, useEffect } from 'react'
import Conversation from './Convesation';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';
import { useAuth } from '../../context/AuthContext';

const ChatList = (prop:any) => {
  const [allConversation, setAllConversation] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  // const {authUser} = useAuth();

  const fetch = async () => {
    try {
      const res = await axiosPrivate.get('/chat/0');
      setAllConversation(Object.values(res?.data));
    }
    catch (error) { console.log("error-->", error)}
  }
  useEffect(() => {
    fetch();
    prop.setRefresh(0);
  }, [prop.refresh]);



  function handleClick() {
    prop.setPopupParent((prev:any) => {
      return ({
        ...prev,
        display:'flex',
      })
    });
  }

  return (
    <div className='chatlist-container'>
        <div className='chatlist-header'>
            <input 
                type="text"
                placeholder="       Search"
                className="input-search-input" />
            <div className='add-group-icon'>
              <img src='/src/assets/group-add.svg' onClick={handleClick}/>
            </div>
        </div>
        <div className='conversations-content'>
          <>
            {allConversation.map((element, index) => (
              <Conversation key={index} setConvInf={prop.setConvInf} {...element} setShow={prop.setShow} />
            ))}
          </>
        </div>
    </div>
  );
};

export default ChatList;
