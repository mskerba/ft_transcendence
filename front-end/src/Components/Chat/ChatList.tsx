import React, { useState, useEffect } from 'react'
import Conversation from './Convesation';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';
import { useAuth } from '../../context/AuthContext';

const ChatList = (prop:any) => {
  const [allConversation, setAllConversation] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  // const {authUser} = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  const handleConversationClick = (id:any) => {
    setSelectedId(id);
  };


  const fetch = async () => {
    try {
      const res = await axiosPrivate.get('/chat');
      // console.log(res.data)
      let conv = Object.values(res?.data);
      if (!allConversation.length)
      {
        conv.forEach((element) => {
          if (element.group)
            prop.socket.current.emit('joinGroup', {group:element.convId});
          else {
            const updatedMap = new Map(prop.usersStatus);
            updatedMap.set(element.userId, element.status); // Remove "online" string and uncomment element.status
            prop.setUsersStatus(updatedMap);
            
            console.log("++++++",prop.usersStatus, updatedMap)
          }
        });
      }
      setAllConversation(conv);
    }

    catch (error) {
      prop.setShowDropdown(true);
      setTimeout(()=>prop.setShowDropdown(false), 3000);
      prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
    }
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
              <Conversation key={index} index={index}
              setSelectedId={setSelectedId} selectedId={selectedId} {...element} setShow={prop.setShow} />
          ))}
          </>
        </div>
    </div>
  );
};

export default ChatList;
