import { useState, useRef } from 'react';
import axios from 'axios';
import "./ChangeAvatar.css";
import useAxiosPrivate from '../../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../../context/AuthContext';

const ChangeAvatar = ({ user, onStateChange }: any) => {
  const [imagePreview, setImagePreview] = useState(`http://10.14.4.10:3000/avatar/${user.avatar}`);
  const [selectedImage, setSelectedImage] = useState(null);
  const { setAuthUser } = useAuth();
  const fileInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

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
      setSelectedImage(file); // Save the selected image for upload
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      console.error('No image selected.');
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
  
      console.log("AVATAAAAAR!", response.data)
      console.log(Date.now())


      onStateChange(response.data);
      setAuthUser(response.data);
      setSelectedImage(null);
    
    } catch (error) {
      console.error('Error uploading image:', error.message);
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
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ChangeAvatar;
