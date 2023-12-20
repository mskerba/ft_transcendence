import React, { useState } from 'react'
import Conversation from './Convesation';
import './chat.css';


const ChatList = (prop:any) => {
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
          <Conversation name={'abdelmounim skerbaabdelmounim sk'} setShow={prop.setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'9Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'hassan sa7rawi'}  setShow={prop.setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'9Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'1Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'2Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'3Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'4Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'5Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'6Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'7Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'8Lorem Ipsum'}  setShow={prop.setShow}/>
          <Conversation name={'hassan sa7rawi'}  setShow={prop.setShow}/>
        </div>
    </div>
  );
};

export default ChatList;
