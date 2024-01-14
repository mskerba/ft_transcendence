import React, { useState, useEffect } from 'react';
import './MakingGame.css';
import { useNavigate } from 'react-router-dom';

const ImageOpponent = () => {
    return (
        <img
        className="waiting-user"
        src={'https://xsgames.co/randomusers/avatar.php?g=male'}
    />);
};

const UserMaking = () => {
    return (
        <img
        className="user-making-game"
        src={'https://xsgames.co/randomusers/avatar.php?g=male'}
    />);
};

const ScoreSection = () => {

    return (
        <div className="score-section">
            <img src={"/src/assets/versus.png.png"} />
            <div className="score-partie">
                <div className="scores"><p>1</p></div>
                <div className="scores"><p>2</p></div>
            </div>
        </div>
    );
}

function EndOfGame() {
    const navigate = useNavigate();
    function handleExit(){
        navigate('/');
    }
    return (
        <div className="end-of-game">
            <div onClick={handleExit}  className='exit-svg-making-game' ><img src='/src/assets/exit.svg'/></div>
            <div className='child-making-game'>
                <UserMaking />
                <ScoreSection />
                <ImageOpponent />
            </div>
        </div>
    );
}

export default EndOfGame;