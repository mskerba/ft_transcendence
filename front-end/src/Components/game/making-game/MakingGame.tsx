import React, { useState, useEffect } from 'react';
// import { animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import './MakingGame.css';

const ImageSwapper = () => {
  const [index, setIndex] = useState(0);


  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
        const allType:any = ["male", 'female', 'pixel'];
      const intervalId = setInterval(() => {
            const type = allType[getRandomInt(0, 2)];
            const randomIndex = getRandomInt(0, (type == 'pixel') ? 53:78);
            setIndex(`https://xsgames.co/randomusers/assets/avatars/${type}/${randomIndex}.jpg`)
    }, 100.0);

    return () => clearInterval(intervalId);
  }, [index]);

  return (
    <img
      className="waiting-user"
      src={index}
      alt={`Image ${index + 1}`}
    />
  );
};

const UserMaking = () => {
    return (
        <img
        className="user-making-game"
        src={'https://xsgames.co/randomusers/avatar.php?g=male'}
      />);
};

function MakingGame() {
    const navigate = useNavigate();
    function handleExit(){
        navigate('/');
    }
  return (
    <div className='making-game'>
        <div onClick={handleExit}  className='exit-svg-making-game' ><img src='/src/assets/exit.svg'/></div>
        <div className='child-making-game'>
            <UserMaking />
            <img src={"/src/assets/versus.png.png"} />
            <ImageSwapper />
        </div>
    </div>
  );
}

export default MakingGame;
