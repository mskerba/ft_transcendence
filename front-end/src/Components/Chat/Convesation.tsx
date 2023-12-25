import React, { useState } from 'react'
import './chat.css';

const timeOfLastMessage = (date:any) => {
  const event = new Date(date);

  event.setHours(event.getHours() + 5);

  const currentDate = new Date();

  if ( event.getDate() === currentDate.getDate() && event.getMonth() === currentDate.getMonth() && event.getFullYear() === currentDate.getFullYear()) {
    const formattedTime = event.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return (formattedTime);
  } else {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor(
    (currentDate - event) / millisecondsInDay
  );

  if (daysDifference < 7) {
    const formattedDate = event.toLocaleString('en-US', {
      weekday: 'short',
      day: '2-digit',
    });
    return (formattedDate);
  } else {
    const formattedDateTime = event.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
    });
    return (formattedDateTime);
  }
}

}

const Conversation = (prop:any) => {

  const date = timeOfLastMessage(prop.Date);
  function handleClick() {
    prop.setConvInf((prev:any) => {
      return {
          ...prev,
          Avatar : prop.Avatar,
          Name: prop.Name,
          convId : prop.convId,
          group : prop.group
      };
    })
    if (innerWidth <925)
      prop.setShow(0);
  }
  return (
    <div className='convesation-container' onClick={handleClick}>
        <img src={prop.Avatar} className='conversation-avatar'/>
        <div className='convesation-info'>
          <div className='name-lastime'>
            <h5>{prop.Name}</h5>
            <p>{date}</p>
          </div>
          <div className='last-message'>
            <p>{prop.lastMsg}</p>
            { (prop.Unseen) ? <div className='number-of-message'>{prop.Unseen}</div> : <></>}
          </div>
        </div>
    </div>
  );
};

export default Conversation;
