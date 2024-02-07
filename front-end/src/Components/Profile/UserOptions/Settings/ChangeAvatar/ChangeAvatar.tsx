import { useState, useRef } from 'react';
import axios from 'axios';
import "./ChangeAvatar.css";
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../../context/AuthContext';
import { toast } from 'react-toastify';

const ChangeAvatar = ({ user, onStateChange }: any) => {
  const [imagePreview, setImagePreview] = useState(`http://localhost:3000/avatar/${user.avatar}`);
  const [selectedImage, setSelectedImage] = useState(null);
  const { setAuthUser } = useAuth();
  const fileInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;

    
    if (file && fileType.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      
      reader.readAsDataURL(file);
      setSelectedImage(file); // Save the selected image for upload
    } else {
      toast.warn('images only!');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.warn('no selected image!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', selectedImage);

      const response = await axiosPrivate.post('/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('the avatar has changed!');


      onStateChange(response.data);
      setAuthUser(response.data);
      setSelectedImage(null);

    } catch (error) {
      console.error('Error uploading image:', error.message);
      toast.error('network error!');
    }
  };

  return (
    <div className='change-avatar-container'>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <img
        className='selected-avatar'
        src={imagePreview || 'default-image.jpg'}
        alt="Preview"
        style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '200px' }}
        onClick={handleImageClick}
      />
      <button onClick={handleUpload} className='upload-avatar-button'><img src='/src/assets/upload.svg' /></button>
    </div>
  );
};

export default ChangeAvatar;
