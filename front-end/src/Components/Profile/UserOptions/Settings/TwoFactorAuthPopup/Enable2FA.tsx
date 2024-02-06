// @ts-ignore
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import './Enable2FA.css'
import { toast } from 'react-toastify';

const EnableTwoFactorAuth = ({ onClose, qrCode, onEnable }) => {
  const [token, setToken] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {

    try {
      const res = await axiosPrivate.post('/auth/enable-2fa', { token });
      if (res?.data) {
        onClose();
        onEnable(true);
        toast.success('Two-Factor Authentication successfully activated. Your account is now more secure.');
      }

    } catch (error) { 
      toast.warn('Oops! The entered 2FA code is incorrect. Please ensure you\'re using the latest code from your authenticator app and try again.');
    }


  };


  return (
    <div className='enable-twofa-container'>
      <h2>Two Factor Authentication</h2>
      <p>Scan the QR code or enter the code into your authenticator app:</p>

      <img src={qrCode} />

      <div className='twofa-auth-box'>
        <h4>Authentication code</h4>
        <input type="text" value={token} onChange={handleTokenChange} />
        <button onClick={handleSubmit}>Submit</button>
        </div>

      <div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EnableTwoFactorAuth;
