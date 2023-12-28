
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TwoFactorAuth.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import DisableTwoFactorAuth from '../Profile/UserOptions/Settings/TwoFactorAuthPopup/Disable2FA';

const TwoFactorVerification = () => {
    const [code, setCode] = useState<string>('');
    const { auth, login, logout } = useAuth();
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: any) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        if (!disable)
        {
            try {
                const res = await axios.post('/auth/verify-2fa', { token: code });
                console.log(res.data);
                if (res?.data == true) login();

            } catch (error) { }
        } else {
            try {
                const res = await axios.post('/auth/disable-2fa', { otp: code })
                console.log(res.data);
                if (res?.data) {
                    login({})
                }

            } catch (error) { }
        }

    };

    const handleCancel = async () => {
        try {
            await axios.get('/auth/clear-cookies');
            logout();
            navigate('/login');

        } catch (error) { }

    };

    const SwitchToDisable = async () => {
        setDisable(true);
        await axios.get('/auth/send-otp');
    };

    return (
        (auth == 2 ? <Navigate to="/" />
            :
            <div className='twofa-container'>
                { (!disable ? 
                    <>
                        <h2>Two-Factor authentification</h2>
                        <h3>Authentification code</h3>
                        <input
                            type="text"
                            id="code-input"
                            value={code}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={SwitchToDisable}>Disable Two Factor Authentication</button>
                    </>
                    :
                    <>
                        <h2>Disable Two Factor Authentication</h2>
                        <label>
                        Enter the code that you have received in your email:
                        <input type="text" value={code} onChange={handleInputChange} />
                        </label>
                
                        <button onClick={handleSubmit}>Submit</button>
                    </>
                )
                }
            </div>
        ));
};

export default TwoFactorVerification;
