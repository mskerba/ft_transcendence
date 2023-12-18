import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import EnableTwoFactorAuth from './Enable2FA';
import DisableTwoFactorAuth from './Disable2FA';

const TwoFactorAuthPopup = ({ isOpen, onClose, qrCode, onEnable, isSwitchedOn }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Two Factor Authentication Popup"
    >
        {
            (isSwitchedOn)
             ? <DisableTwoFactorAuth onClose={onClose} onEnable={onEnable}/>
             : <EnableTwoFactorAuth onClose={onClose} qrCode={qrCode} onEnable={onEnable}/>
        }

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default TwoFactorAuthPopup;
