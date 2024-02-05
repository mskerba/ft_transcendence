import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Home.css'

const Home = () => {
  const navigate = useNavigate();
  const { setRandomKey}: any = useAuth();
  
  const handlePlayWithoutPowers = () => {
    setRandomKey("withoutPowers");
    navigate('/game')
  }

  const handlePlayWithPowers = () => {
    setRandomKey("");
    navigate('/game')
  }

  return (
    <div className="home-parent">
      <div className="default-game" onClick={handlePlayWithoutPowers}>
        <div className='image-default-game'>
          <img src={"src/assets/Planet9_3840x2160.jpg"}/>
        </div>
        <div className="game-type-paragraph">
          <p>Simple game</p>
        </div>
      </div>
      
      <div className="powerups-game" onClick={handlePlayWithPowers}>
        <div className='image-powerups-game'>
          <img src={"src/assets/Planet9_3840x2160.jpg"}/>
        </div>
        <div className="game-type-paragraph">
          <p>poweUp game</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
