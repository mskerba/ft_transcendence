import { useAuth } from '../../context/AuthContext';
import './login.css';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const { auth } = useAuth();


  return (
    (auth == 2 ? <Navigate to="/profile" />
    :
    <div className='login-container'>
      <h1>Welcome back</h1>
      <p>Welcome to the Ping Pong Party! Smash some rallies, chat with your pingGreen pals, and sign in to the fun. Let's bounce into the action! 🏓🎉</p>
      <a href="http://localhost:3000/auth/google" className="login-button">
        <img src='src/assets/google.svg'/>
        Continue with Google
      </a>
      <a href="http://localhost:3000/auth/42" className="login-button">
        <img src='src/assets/42.svg'/>
        Continue with 42 intra
      </a>
    </div>
  ));
};

export default Login;
