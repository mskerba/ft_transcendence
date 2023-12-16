import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';

const EnableTwoFactorAuth = ({ onClose, secretKey, onEnable }) => {
  const [token, setToken] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {
    console.log('Submitted token:', token);

    try {
      const res = await axiosPrivate.post('/auth/enable-2fa', { token });
      console.log(res.data);
      if (res?.data) {
        onClose();
        onEnable(true);
      }

    } catch (error) { console.log(error); }


  };


  return (
    <>
        <h2>Two Factor Authentication</h2>
        <p>Scan the QR code or enter the code into your authenticator app:</p>

        <div>
          <QRCode value={secretKey} />
        </div>

        <p>Code: {secretKey}</p>

        <label>
          Enter Token:
          <input type="text" value={token} onChange={handleTokenChange} />
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </>
  );
};

export default EnableTwoFactorAuth;
