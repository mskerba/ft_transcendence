import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import './Settings.css'
import { useEffect, useState } from 'react';
import TwoFactorAuthPopup from './TwoFactorAuthPopup/TwoFactorAuthPopup';


const Settings = () => {
    const [isSwitchedOn, setIsSwitchedOn] = useState(true);
    const [username, setUsername] = useState<string>('momeaizi');
    const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
    const [secretKey, setSecretKey] = useState<string>();
    
    const   axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const isEnabled = async () => {
            const res = await axiosPrivate.get('/auth/is-2fa-enabled');
            setIsSwitchedOn(res.data);
        }
        isEnabled();
      }, []);


    const handleSwitchToggle = async () => {
        if (!isSwitchedOn) {
            const res = await axiosPrivate.get('auth/secret-2fa');
            console.log(res.data);
            setSecretKey(res.data.secretKey);
            setPopupOpen(true);
        } // else { show the user where he can type the token the disable the 2FA }
    };
    
    const handleInputChange = (e: any) => {
        setUsername(e.target.value);
    };
  
    const closePopup = () => {
      setPopupOpen(false);
    };

    return (
        <div className='settings'>
            <img src='https://thispersondoesnotexist.com/'/>
            <input
                type="text"
                id="username-input"
                value={username}
                onChange={handleInputChange}
            />
            <div className='twoFA'>
                <p>Two-factor authentication (2fa)</p>
                <div className={`switch-container ${isSwitchedOn ? 'on' : 'off'}`} onClick={handleSwitchToggle}>
                    <div className="switch-circle"></div>
                </div>
            </div>
            <TwoFactorAuthPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                secretKey={secretKey}
            />
        </div>
    );
}

export default Settings;
