import { useEffect, useState, useRef }  from 'react';
import ScoreBoard from "./score-board/ScoreBoard";
import Canva from "./canva/Canva";
// import './Game.css'
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Game() {
  const [inGame, setInGame] = useState(false);
  const [playersInfo, setPlayersInfo] = useState();
  const socketRef = useRef(null);
  const test:String='canva';
  const {authUse, randomKey, setRandomKey, setRootAppStyle} = useAuth();
  const navigate = useNavigate();

  let [canvaStyle,setCanvaStyle]: any = useState({
    width: `${window.innerWidth}`,
    height: `700`
  });
  
  const isFirstRender = useRef(true);

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
    if (socketRef.current === null) {
      setRootAppStyle(()=>{return({'grid-template-rows': '1fr'})})
      socketRef.current = io('http://localhost:3000/game', {
        transports: ["websocket"],
        withCredentials: true,
        query: { key: randomKey },
      });
      
      socketRef.current.on('inGame', (data:any)=>{
        setInGame(true)
      });


      socketRef.current.on('stopGame', (data:any)=>{
        console.log("FDSfds", data)
        navigate('/');
        socketRef.current.close();
      });

      socketRef.current.on('playersinfo', (data:any)=>{
        setPlayersInfo(data);
        console.log('in playersinfo', data, playersInfo)
      });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      setRootAppStyle(()=>{return({})})
      setRandomKey("");
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

  if (isFirstRender.current) {
    handleResize();
    isFirstRender.current = false;
  }

  window.addEventListener('load',handleResize);
  window.addEventListener("resize",  handleResize);
  } ,[canvaStyle])

  return (
    <>
      { !inGame &&
        <h1>Making The Game</h1>
      }
     { inGame &&
       <div className='game--page'>
          <div className='game--component'  style={canvaStyle} >
              <ScoreBoard socket={socketRef} playersInfo={playersInfo} size={canvaStyle}/>
              <Canva socket={socketRef} className={test} size={canvaStyle}/>
          </div>
      </div>
      }
    </>
  )
}

export default Game 