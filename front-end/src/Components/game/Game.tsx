import React, {useRef} from 'react'
import { useEffect, useState }  from 'react';
import ScoreBoard from "./score-board/ScoreBoard";
import Canva from "./canva/Canva";
// import './Game.css'
import io from 'socket.io-client';

function Game() {
  const socketRef = useRef(null);
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
  

  useEffect(() => {
    // Only create the socket once
    if (socketRef.current === null) {
      socketRef.current = io('http://localhost:3000/game', {
        transports: ["websocket"],
        withCredentials: true,
      });


      socketRef.current.emit('UserID', {userId: 0}); 
    
      socketRef.current.on('FrontDirectMessage', (data:any) => {
        console.log("DFSDF",data)
      })

    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); 

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