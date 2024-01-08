import Modal from 'react-modal';
import EnableTwoFactorAuth from './Enable2FA';
import DisableTwoFactorAuth from './Disable2FA';

const TwoFactorAuthPopup = ({ isOpen, onClose, qrCode, onEnable, isSwitchedOn }) => {

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#025951',
      borderRadius: '8px',
      border: '2px solid #0CF25D',
    },
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Two Factor Authentication Popup"
      style={customStyles}
    >
      <div className='modal-container'>
        {
            (isSwitchedOn)
             ? <DisableTwoFactorAuth onClose={onClose} onEnable={onEnable}/>
             : <EnableTwoFactorAuth onClose={onClose} qrCode={qrCode} onEnable={onEnable}/>
        }
      </div>
    </Modal>
  );
};

export default TwoFactorAuthPopup;
