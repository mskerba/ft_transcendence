import './Settings.css'
import { useState } from 'react';

const Settings = () => {
    const [isSwitchedOn, setIsSwitchedOn] = useState(false);
    const [inputValue, setInputValue] = useState('momeaizi');

    const handleSwitchToggle = () => {
        setIsSwitchedOn(!isSwitchedOn);
    };
    
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
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
        </div>
    );
}

export default Settings;
