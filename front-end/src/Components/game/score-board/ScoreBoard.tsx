import React from 'react'
import { useEffect, useState }  from 'react';
import  useAxiosPrivate  from '../../../hooks/UseAxiosPrivate';
import Timer from './Timer'
import UserData from './UserData'
import '../Game.css'
import Emoji from "./Emoji";
import Setting from "./Setting";
import { useAuth } from '../../../context/AuthContext';

function ScoreBoard(prop:any) {
  const {authUser}:any = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [SBstyle, setSBstyle] = useState(prop.size);
  const [player1, setPlayer1] = useState({name:"", avatar:''})
  const [player2, setPlayer2] = useState({name:"", avatar:''})

  const [scoreInGame, setScore] = useState({player1:0, player2:0})
  
  useEffect(
    () =>{
      setSBstyle((prev:any) => {
        return {
          ...prev,
          width: `${prop.size.width - 20}px`,
        }
      })
  } ,[prop.size])

  // 'user/{id}';

  useEffect(() => {
    const fetch = async () => {
      try {
        let res:any;
        if (prop.playersInfo) {
          res = await axiosPrivate.get(`/user/${prop.playersInfo.player1}`);
          setPlayer1((prev:any)=> {
            return ({
              ...prev,
              name: res.data.name,
              avatar: res.data.avatar
            })
          });
          
          res = await axiosPrivate.get(`/user/${prop.playersInfo.player2}`);
          setPlayer2((prev:any)=> {
            return ({
              ...prev,
              name: res.data.name,
              avatar: res.data.avatar
            })
          })
          console.log(player1 ,player2)
        }
        console.log(prop.playersInfo);
      }
      catch (error) {
        console.log("-waahamid-->",error)
      }
    }
    fetch();
  },[prop.playersInfo]);

  useEffect(() =>{
    setTimeout(()=>{
        prop.socket.current.on('score', (data:any) => {
        setScore(data.score);
      })}, 0);
    },[prop.socket])

  return (
    <div className='score--board' style={SBstyle}>
        <Setting />
        <UserData className='player1 players' image={`http://localhost:3000/avatar/${player1.avatar}`} userName={player1.name}/>
        <Timer  scoreInGame={scoreInGame}/>
        <UserData  className='player2 players' image={`http://localhost:3000/avatar/${player2.avatar}`} userName={player2.name}/>
        <Emoji />
    </div>
  )
}

export default ScoreBoard
