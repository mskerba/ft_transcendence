// @ts-ignore
import React, { useState, useEffect } from 'react'
import Conversation from './Convesation';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';
import { useAuth } from '../../context/AuthContext';

const ChatList = (prop:any) => {
  const [allConversation, setAllConversation] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [searchText, setSearchText] = useState('');
  const [conversationFilter, setConversationFilter] = useState([]);
  // const {authUser} = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  // const handleConversationClick = (id:any) => {
  //   setSelectedId(id);
  // };


  const handleSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
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
            prop.setUsersStatus(prop.usersStatus.set(element.userId, element.status))
            
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

  useEffect(()=>{
    setConversationFilter(allConversation.filter((conv:any) => conv.Name.toLowerCase().includes(searchText.toLowerCase())))
  }, [searchText])

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
                placeholder="  Search"
                className="input-search-input" 
                value={searchText}
                onChange={handleSearchTextChange} />
            <div className='add-group-icon'>
              <img src='/src/assets/group-add.svg' onClick={handleClick}/>
            </div>
        </div>
        <div className='conversations-content'>
          <>
          {searchText === '' && allConversation.map((element, index) => (
              <Conversation key={index} index={index}
              setSelectedId={setSelectedId} selectedId={selectedId} {...element} setShow={prop.setShow} setAllConversation={setAllConversation} allConversation={allConversation} />
          ))}
          
          {searchText !== '' && conversationFilter.map((element, index) => (
              <Conversation key={index} index={index}
              setSelectedId={setSelectedId} selectedId={selectedId} {...element} setShow={prop.setShow} setConversationFilter={setConversationFilter} conversationFilter={conversationFilter} />
          ))}
          </>
        </div>
    </div>
  );
};

export default ChatList;
