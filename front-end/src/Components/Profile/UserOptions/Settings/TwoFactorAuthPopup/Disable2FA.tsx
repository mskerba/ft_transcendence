// @ts-ignore
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import './Enable2FA.css'
import { toast } from 'react-toastify';

const DisableTwoFactorAuth = ({ onClose, onEnable }) => {
  const [token, setToken] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {

    try {
      const res = await axiosPrivate.post('/auth/disable-2fa', { otp: token });
      if (res?.data) {
        onClose();
        onEnable(false);
        toast.success('Two-Factor Authentication has been successfully deactivated.');
      }

    } catch (error) { 
      toast.warn('Oops! The entered 2FA code is incorrect. Please ensure you\'re using the latest code from your authenticator app and try again.');
    }


  };


  return (
    <div className='enable-twofa-container'>
      <h2>Disable Two Factor Authentication</h2>
      <p>the code has been sent to your email:</p>
      <div className='twofa-auth-box'>
        <h4>Authentication code</h4>
        <input type="text" value={token} onChange={handleTokenChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <button onClick={onClose}>Close</button>

    </div>
  );
};

export default DisableTwoFactorAuth;
