import React, { useState } from 'react'
import Conversation from './Convesation';
import './chat.css';


const ChatList = ({setShow}:any) => {
  
  return (
    <div className='chatlist-container'>
        <div className='chatlist-header'>
            <input 
                type="text"
                placeholder="       Search"
                className="input-search-input" />
            <img src='src/assets/group-add.svg'/>
        </div>
        <div className='conversations-content'>
          <Conversation name={'abdelmounim skerbaabdelmounim sk'} setShow={setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'9Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'hassan sa7rawi'}  setShow={setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'9Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={setShow}/>
          <Conversation name={'hassan sa7rawi'}  setShow={setShow}/>
        </div>
    </div>
  );
};

export default ChatList;
