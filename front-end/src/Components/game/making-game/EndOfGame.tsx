// @ts-ignore
import React, { useState, useEffect } from 'react';
import './MakingGame.css';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../context/AuthContext';

const ImageOpponent = ({player2}:any) => {
    return (
        <div className='player2-image-end-game'>
        {player2.avatar && <img
        
        src={`http://localhost:3000/avatar/${player2.avatar}`}
        />}
        <p>{player2.name}</p>
        </div>
    );
};

const UserMaking = ({player1}:any) => {
    return (
        <div className='player1-image-end-game'>
            {player1.avatar && <img
            
            src={`http://localhost:3000/avatar/${player1.avatar}`}
            />}
            <p>{player1.name}</p>
        </div>
    );
};

const ScoreSection = ({finaleGameScore}:any) => {
    return (
        <div className="score-section">
            <img src={"/src/assets/versus.png.png"}/>
            <div className="score-partie">
                <div className="scores"><p>{finaleGameScore.player1}</p></div>
                <div className="scores"><p>{finaleGameScore.player2}</p></div>
            </div>
        </div>
    );
}

function EndOfGame({playersInfo, finaleGameScore}:any) {
    const [player1, setPlayer1] = useState({userId:-1,name:"", avatar:''})
    const [player2, setPlayer2] = useState({userId:-1,name:"", avatar:''})
    const [styling, setStyling] = useState({backgroundColor:'green'});
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {authUser}:any = useAuth();

    function handleExit(){
        navigate('/');
    }
    useEffect(() => {
        const fetch = async () => {
            try {
              let res:any;
              if (playersInfo) {
                res = await axiosPrivate.get(`/user/${playersInfo.player1}`);
                setPlayer1((prev:any)=> {
                  return ({
                    ...prev,
                    userId:res.data.userId,
                    name: res.data.name,
                    avatar: res.data.avatar
                  })
                });
                res = await axiosPrivate.get(`/user/${playersInfo.player2}`);
                setPlayer2((prev:any)=> {
                    return ({
                        ...prev,
                        userId:res.data.userId,
                        name: res.data.name,
                        avatar: res.data.avatar
                    })
                })

              }
            }
            catch (error) {
              console.log("-waahamid-->",error)
            }
          }
          fetch();
    },[playersInfo]);


    useEffect(()=>{        
        if ((player1.userId == authUser.userId && finaleGameScore.player1 < finaleGameScore.player2) ||
        (player2.userId == authUser.userId && finaleGameScore.player1 > finaleGameScore.player2))
        {
            setStyling((prev:any)=> {
                return ({
                    ...prev,
                    backgroundColor:'red',
                })
            })
        }
    },[player1.userId,player2.userId])

    return (
        <div className="end-of-game" style={styling}>
            <div className="end-of-game-child">
                <div onClick={handleExit}  className='exit-svg-end-game' ><img src='/src/assets/exit.svg'/></div>
                <div className='child-end-game'>
                    <UserMaking player1={player1}/>
                    <ScoreSection finaleGameScore={finaleGameScore} />
                    <ImageOpponent  player2={player2}/>
                </div>
            </div>
        </div>
    );
}

export default EndOfGame;