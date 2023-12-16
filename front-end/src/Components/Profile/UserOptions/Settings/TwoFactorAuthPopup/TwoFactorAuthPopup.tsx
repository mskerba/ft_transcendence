import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import EnableTwoFactorAuth from './Enable2FAPopup';
import DisableTwoFactorAuth from './Disable2FAPopup';

const TwoFactorAuthPopup = ({ isOpen, onClose, secretKey, onEnable, isSwitchedOn }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Two Factor Authentication Popup"
    >
        {
            (isSwitchedOn)
             ? <DisableTwoFactorAuth onClose onEnable/>
             : <EnableTwoFactorAuth onClose secretKey onEnable/>
        }

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default TwoFactorAuthPopup;
