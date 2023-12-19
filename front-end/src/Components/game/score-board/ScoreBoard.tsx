import React from 'react'
import { useEffect, useState }  from 'react';
import Timer from './Timer'
import UserData from './UserData'
import '../Game.css'
import Emoji from "./Emoji";
import Setting from "./Setting";

function ScoreBoard(prop:any) {
  let [SBstyle,setSBstyle] = useState(prop.size);
  
  useEffect(
    () =>{
      setSBstyle((prev:any) => {
        return {
          ...prev,
          width: `${prop.size.width - 20}px`,
        }
      })
  } ,[prop.size])


  return (
    <div className='score--board' style={SBstyle}>
        <Setting />
        <UserData className='player1 players' image='https://thispersondoesnotexist.com/' userName='jack' levle='1.5'/>
        <Timer />
        <UserData className='player2 players' image='https://thispersondoesnotexist.com/' userName='freed' levle='1.5'/>
        <Emoji />
    </div>
  )
}

export default ScoreBoard
