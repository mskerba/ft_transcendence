// @ts-ignore
import React, { useState, useEffect } from 'react';
import '../Game.css'

function Timer(prop:any) {

  const [pvs, setPvs] = useState({
    border:'1px solid rgb(0,255,0,.8)',
    'backgroundColor': 'rgb(255,255,255,.8)',
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      prop.setTime((prevTime:any) => {
        if (!prevTime) {
          clearInterval(intervalId);
          return prevTime;
        }
        if(prevTime < 11)
        {
          setPvs((prevPvs:any) => {
            return {
              ...prevPvs,
              border:'1px solid rgb(255,0,0,.8)',
              color:'red'
            }
          })
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='game--timer'>
        <p>{prop.scoreInGame.player1}</p>
        <div className='timing--text' style={pvs}>
          <p>{prop.time < 10 ? `0${prop.time}` : prop.time}'</p>
        </div>
        <p>{prop.scoreInGame.player2}</p>
    </div>
  );
}

export default Timer;
