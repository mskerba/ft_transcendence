import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';

const TwoFactorAuthPopup = ({ isOpen, onClose, secretKey }) => {
  const [asciiCode, setAsciiCode] = useState('');

  useEffect(() => {
    // Convert secretKey to ASCII code for display
    const asciiCodes = secretKey.split('').map(char => char.charCodeAt(0));
    setAsciiCode(asciiCodes.join(' '));
  }, [secretKey]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Two Factor Authentication Popup"
    >
      <h2>Two Factor Authentication</h2>
      <p>Scan the QR code or enter the ASCII code into your authenticator app:</p>

      <div>
        <QRCode value={secretKey} />
      </div>

      <p>ASCII Code: {asciiCode}</p>

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default TwoFactorAuthPopup;
