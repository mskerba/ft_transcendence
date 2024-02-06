import { useEffect, useState, useRef } from 'react';
import ScoreBoard from "./score-board/ScoreBoard";
import MakingGame from "./making-game/MakingGame";
import EndOfGame from "./making-game/EndOfGame";
import Canva from "./canva/Canva";
// import './Game.css'
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Game() {
  const [inGame, setInGame] = useState(0);
  const [time, setTime] = useState(60);
  const [playersInfo, setPlayersInfo] = useState();
  const [finaleGameScore, setFinaleGameScore] = useState();
  const socketRefGame = useRef(null);
  const test: String = 'canva';
  const {isInGame, setIsInGame, authUser, randomKey, setRandomKey, setRootAppStyle, socketRef}: any = useAuth();
  const navigate = useNavigate();

  let [canvaStyle, setCanvaStyle]: any = useState({
    width: `${window.innerWidth}`,
    height: `700`
  });

  const isFirstRender = useRef(true);

  let size: number[] = [
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
    if (socketRefGame.current === null) {
      setIsInGame(true);

      setRootAppStyle(() => { return ({ gridTemplateRows: '1fr' }) })
      socketRefGame.current = io('http://localhost:3000/game', {
        transports: ["websocket"],
        withCredentials: true,
        query: { key: randomKey , userId:authUser.userId},
      });
      socketRefGame.current.on('inGame', (data: any) => {
        setInGame(1);
      });


      socketRefGame.current.on('stopGame', (data: any) => {
        setInGame(2);
        setFinaleGameScore(data.score);
        // navigate('/');
        // socketRefGame.current.close();
      });

      socketRefGame.current.on('playersinfo', (data: any) => {
        setPlayersInfo(data);
      });
    }

    if (socketRef.current !== null) {
      socketRef.current.emit("inGame", true)
    }

    return () => {
      if (socketRefGame.current !== null) {
        socketRefGame.current.disconnect();
        setIsInGame(false);
        socketRefGame.current = null;
        if (socketRef.current !== null) {
          socketRef.current.emit("inGame", false);
        }

        setRootAppStyle(() => { return ({}) })
        setRandomKey("");
      }
    };
  }, []);

  useEffect(()=>{
    if (socketRefGame.current !== null && inGame == 2) {
      socketRefGame.current.disconnect();
      setIsInGame(false);
      socketRefGame.current = null;
      if (socketRef.current !== null) {
        socketRef.current.emit("inGame", false);
      }

      setRootAppStyle(() => { return ({}) })
      setRandomKey("");
    }
  },[inGame])

  useEffect(
    () => {
      function handleResize() {
        if (canvaStyle.height > innerHeight) {
          setCanvaStyle((prev: any) => {
            return {
              ...prev,
              width: `${(innerHeight - 50) * (1100 / 730)}`,
              height: `${innerHeight - 50}`
            }
          })
          return;
        }
        for (let i = 0; i < size.length; i++) {
          if (size[i] <= innerWidth) {

            setCanvaStyle((prev: any) => {
              return {
                ...prev,
                width: `${size[i]}`,
                height: `${size[i]}`
              }
            })
            return;
          }
        }
      }

      if (isFirstRender.current) {
        handleResize();
        isFirstRender.current = false;
      }

      window.addEventListener('load', handleResize);
      window.addEventListener("resize", handleResize);
    }, [canvaStyle])

  return (
    <>
      {(inGame == 0) &&
        <MakingGame />
      }
      {(inGame == 1) &&
        <div className='game--page'>
          <div className='game--component' style={canvaStyle} >
            <ScoreBoard socket={socketRefGame} playersInfo={playersInfo} size={canvaStyle} time={time} setTime={setTime} />
            <Canva socket={socketRefGame} className={test} size={canvaStyle} time={time} />
          </div>
        </div>
      }
      {(inGame == 2) &&
        <EndOfGame playersInfo={playersInfo} finaleGameScore={finaleGameScore} />
      }
    </>
  )
}

export default Game 