import React, { useState } from 'react'
import './chat.css';


const Conversation = (prop:any) => {
  
  return (
    <div className='convesation-container'>
        <img src='https://thispersondoesnotexist.com/' className='conversation-avatar'/>
        <div className='convesation-info'>
          <div className='name-lastime'>
            <h5>{prop.name}</h5>
            <p>Feb</p>
          </div>
          <div className='last-message'>
            <p>is simply dummy text of the printing</p>
            <div className='number-of-message'>5</div>
          </div>
        </div>
    </div>
  );
};

export default Conversation;
