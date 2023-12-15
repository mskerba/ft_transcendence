import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import './Settings.css'
import { useEffect, useState } from 'react';
import TwoFactorAuthPopup from './TwoFactorAuthPopup/TwoFactorAuthPopup';

const Settings = () => {
    const [isSwitchedOn, setIsSwitchedOn] = useState(true);
    const [inputValue, setInputValue] = useState('momeaizi');
    const   axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const isEnabled = async () => {
            const res = await axiosPrivate.get('/auth/is-2fa-enabled');
            setIsSwitchedOn(res.data);
        }
        isEnabled();
      }, []);


    const handleSwitchToggle = () => {
        if (!isSwitchedOn) setPopupOpen(true);
        setIsSwitchedOn(!isSwitchedOn);
    };
    
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };


    const [isPopupOpen, setPopupOpen] = useState(false);
    const secretKey = 'your-secret-key-from-server';
  
    const closePopup = () => {
      setPopupOpen(false);
    };

    return (
        <div className='settings'>
            <img src='https://thispersondoesnotexist.com/'/>
            <input
                type="text"
                id="username-input"
                value={inputValue}
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
