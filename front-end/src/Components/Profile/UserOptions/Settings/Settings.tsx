import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import './Settings.css'
import { useEffect, useState } from 'react';
import TwoFactorAuthPopup from './TwoFactorAuthPopup/TwoFactorAuthPopup';
import ChangeAvatar from './ChangeAvatar/ChangeAvatar';
import { useAuth } from '../../../../context/AuthContext';


const Settings = ({ user, onStateChange }: any) => {
    const [isSwitchedOn, setIsSwitchedOn] = useState(false);
    const [username, setUsername] = useState<string>(user.name);
    const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
    const [errormsg, setError] = useState<string>('');
    const [qrCode, setQrCode] = useState();
    const { setAuthUser } = useAuth();
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
            setQrCode(res?.data.qrCode);
        } else {
            await axiosPrivate.get('/auth/send-otp');
        }
        setPopupOpen(true);
    };
    
    const handleInputChange = (e: any) => {
        setUsername(e.target.value);
    };
  
    const closePopup = () => {
      setPopupOpen(false);
    };

    const changeUsername = async () => {
        try {
            setError('');
            if (user.name === username)
                return ;
            const res = await axiosPrivate.patch(`/user/${user.userId}`, {name: username});
            onStateChange(res.data);
            setAuthUser(res.data);
        } catch (error) {
            setError(`the name \`${username}\` already exists!`);

        }
    }

    return (
        <div className='settings'>
            <ChangeAvatar user={user} onStateChange={onStateChange} />
            <div className='change-username'>
                <input
                    type="text"
                    id="username-input"
                    value={username}
                    onChange={handleInputChange}
                />
                <button onClick={changeUsername}>save</button>
                {errormsg && <p>{errormsg}</p>}
            </div>
            <div className='twoFA'>
                <p>Two-factor authentication (2fa)</p>
                <div className={`switch-container ${isSwitchedOn ? 'on' : 'off'}`} onClick={handleSwitchToggle}>
                    <div className="switch-circle"></div>
                </div>
            </div>
            <TwoFactorAuthPopup
                isSwitchedOn={isSwitchedOn}
                isOpen={isPopupOpen}
                onClose={closePopup}
                qrCode={qrCode}
                onEnable={setIsSwitchedOn}
            />
        </div>
    );
}

export default Settings;
