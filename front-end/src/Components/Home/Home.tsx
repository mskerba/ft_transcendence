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
          Simple game
      </div>
      
      <div className="powerups-game" onClick={handlePlayWithPowers}>
          poweUp game
      </div>
    </div>
  );
};

export default Home;
