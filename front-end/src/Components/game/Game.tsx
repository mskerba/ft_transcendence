import React from 'react'
import { useEffect, useState }  from 'react';
import ScoreBoard from "./score-board/ScoreBoard";
import Canva from "./canva/Canva";
// import io from 'socket.io-client';
import './Game.css'

function Game() {
  // const socket = io('ws://localhost:3000');
  const test:String='canva';

  let [canvaStyle,setCanvaStyle]: any = useState({
    width: `${window.innerWidth}`,
    height: `700`
  });
  
  let size:number[] = [
    1100,
    1000,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
  ];
  
  // useEffect(() => {
  //   socket.on('gamepaddleResponse', (data:any) => {
  //     console.log('Received gamepaddleResponse:', data);
  //   });

  //   socket.emit('gamepaddle', {'x': 78})
    
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);


  useEffect(
    () =>{
    function handleResize(){
      if (canvaStyle.height > innerHeight)
      {
        setCanvaStyle((prev:any)=>{
          return {
            ...prev,
            width: `${(innerHeight -50) * (1100/730)}`,
            height:`${innerHeight - 50}`
          }})
        return ;
      }
      for (let i = 0; i < size.length; i++)
      {
        if (size[i] <= innerWidth)
        {

          setCanvaStyle((prev:any)=>{
            return {
              ...prev,
              width: `${size[i]}`,
              height:`${size[i]}`
            }})
            return ;
        }
      }
  }
  window.addEventListener('load',handleResize);
  window.addEventListener("resize",  handleResize);
  } ,[window])
  console.log(canvaStyle.width,canvaStyle.height)
  return (
    <div className='game--page'>
        <div className='game--component'  style={canvaStyle} >
            <ScoreBoard size={canvaStyle}/>
            <Canva className={test} size={canvaStyle}/>
        </div>
    </div>
  )
}

export default Game 