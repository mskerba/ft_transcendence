import "./ChangeAvatar.css"



import React, { useState, useRef } from 'react';

const ChangeAvatar = ({ user, onStateChange }: any) => {
  const [imagePreview, setImagePreview] = useState(user.avatar);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <img
        src={imagePreview || 'default-image.jpg'}
        alt="Preview"
        style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '200px' }}
        onClick={handleImageClick}
      />
    </div>
  );
};

export default ChangeAvatar;

