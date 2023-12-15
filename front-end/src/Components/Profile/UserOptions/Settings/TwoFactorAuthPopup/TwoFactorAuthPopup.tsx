import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import base32Encode from 'base32-encode';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';

const TwoFactorAuthPopup = ({ isOpen, onClose, secretKey }) => {
  const [token, setToken] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = async () => {
    // Handle the submitted token, for example, send it to the server for verification
    console.log('Submitted token:', token);

    // You may want to perform additional actions here, such as validation and verification
    try {
      const res = await axiosPrivate.post('/auth/enable-2fa', { token });
      console.log(res.data);
      onClose();

    } catch (error) { console.log(error); }


  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Two Factor Authentication Popup"
    >
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

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default TwoFactorAuthPopup;
