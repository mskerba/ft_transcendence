
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TwoFactorAuth.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import DisableTwoFactorAuth from '../Profile/UserOptions/Settings/TwoFactorAuthPopup/Disable2FA';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import { toast } from 'react-toastify';

const TwoFactorVerification = () => {
    const [code, setCode] = useState<string>('');
    const { auth, login, logout } = useAuth();
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const handleInputChange = (e: any) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        if (!disable) {
            try {
                const res = await axios.post('/auth/verify-2fa', { token: code });
                if (res?.data == true) {
                    const res = await axiosPrivate.get('/user');
                    if (res.status == 200) {
                        login(res?.data);
                    }
                }

            } catch (error) { 
                toast.warn('Oops! The entered 2FA code is incorrect. Please ensure you\'re using the latest code from your authenticator app and try again.');
            }
        } else {
            try {
                const res = await axios.post('/auth/disable-2fa', { otp: code });
                if (res?.status < 300) {
                    const res = await axiosPrivate.get('/user');
                    if (res.status == 200) {
                        login(res?.data);
                    }
                }

            } catch (error) {
                toast.warn('Oops! The entered 2FA code is incorrect. Please ensure you\'re using the latest code from your authenticator app and try again.');
             }
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
            <div className='twofa-body'>
                <div className='twofa-container'>
                    {(!disable ?
                        <div className='enable-twofa-container'>
                            <h2>Two-Factor authentification</h2>
                            <div className='twofa-auth-box'>
                                <h3>Authentification code</h3>
                                <input
                                    type="text"
                                    id="code-input"
                                    value={code}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleSubmit}>Submit</button>
                            </div>
                            <div className='twofa-page-buttons'>
                                <button onClick={SwitchToDisable}>Disable (2fa)</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                        :

                        <div className='enable-twofa-container'>
                            <h2>Disable Two Factor Authentication</h2>
                            <p>the code has been sent to your email:</p>
                            <div className='twofa-auth-box'>
                                <h4>Authentication code</h4>
                                <input type="text" value={code} onChange={handleInputChange} />
                                <button onClick={handleSubmit}>Submit</button>
                            </div>

                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    )
                    }
                </div>
            </div>
        ));
};

export default TwoFactorVerification;
