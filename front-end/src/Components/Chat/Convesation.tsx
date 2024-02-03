import React, { useEffect, useState } from 'react'
import './chat.css';
import { useAuth } from '../../context/AuthContext';

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
  const [UnseenState, setUnseen] = useState(0);
  const { setConvInf, socketRef, convInf}: any = useAuth();
  const date = timeOfLastMessage(prop.Date);
  const style = {
    background:'green',
  }


  useEffect(()=>{
    if (convInf.convId == prop.convId){
      if (prop.group)
        socketRef.current.emit('seen', { convId:  prop.convId, isGroup: true });
      else 
        socketRef.current.emit('seen', { convId:  prop.convId, isGroup: false });
    } else
    setUnseen(prop.Unseen);
  }, [prop.Unseen])

  useEffect(()=>{
    if (convInf.convId == prop.convId){
      if (prop.group)
        socketRef.current.emit('seen', { convId:  prop.convId, isGroup: true });
      else 
        socketRef.current.emit('seen', { convId:  prop.convId, isGroup: false });
    } else
    setUnseen(prop.Unseen);
  }, [])

  function handleClick() {
    if (prop.group)
      socketRef.current.emit('seen', { convId:  prop.convId, isGroup: true });
    else 
      socketRef.current.emit('seen', { convId:  prop.convId, isGroup: false });
    console.log(UnseenState)
    setUnseen(0);
    setConvInf((prev:any) => {
      return {
        ...prev,
        Avatar : prop.Avatar,
        Name: prop.Name,
        convId : prop.convId,
        group : prop.group,
        Id: prop.userId
      };
    })
    if (innerWidth <925)
      prop.setShow(0);

    prop.setSelectedId(prop.convId)
  }

  return (
      <div className='convesation-container' onClick={handleClick}style={{
      backgroundColor: (prop.selectedId == prop.convId) ? '#038C3E' : '',}}
>
      <img src={`http://localhost:3000/avatar/${prop.Avatar}`} className='conversation-avatar'/>
      <div className='convesation-info'>
        <div className='name-lastime'>
          <h5>{prop.Name}</h5>
          <p>{date}</p>
        </div>
        <div className='last-message'>
          <p>{prop.lastMsg}</p>
          { (UnseenState) ? <div className='number-of-message'>{UnseenState}</div> : <></>}
          {/* { (prop.Unseen) ? <div className='number-of-message'>{prop.Unseen}</div> : <></>} */}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
