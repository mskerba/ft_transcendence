import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';

const DisableTwoFactorAuth = ({ onClose, onEnable }) => {
  const [token, setToken] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {

    try {
      const res = await axiosPrivate.post('/auth/disable-2fa', { otp: token })
      console.log(res.data);
      if (res?.data) {
        onClose();
        onEnable(false);
      }

    } catch (error) { console.log(error); }


  };


  return (
    <>
        <h2>Disable Two Factor Authentication</h2>
        <label>
          Enter the code that you have received in your email:
          <input type="text" value={token} onChange={handleTokenChange} />
        </label>

        <button onClick={handleSubmit}>Submit</button>

      </>
  );
};

export default DisableTwoFactorAuth;
