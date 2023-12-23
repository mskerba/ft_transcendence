import React, { useState, useRef, useEffect } from 'react';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';

const PopupCreatGroup = (prop:any) => {
  const [channelType, setChannelType] = useState('public');
  const [channelPassword, setChannelPassword] = useState('');
  const [nameOfGroup, setNameOfGroup] = useState('');
  const axiosPrivate = useAxiosPrivate();

  const fetch = async () => {
    try {
      const postGroup:any = {
        UserId: 0,//number
        TypeRoom: channelType, // protected , public, private
        // avarar: '',//link
        title: nameOfGroup, 
      };
      (channelType == 'protected') ? postGroup.password = channelPassword : '';
      const res = await axiosPrivate.post("/chat", postGroup);
      console.log(res);
    }
    catch (error) { console.log("error-->", error)}

    handleCloseClick();
  }

  const handleInputChange = (event:any) => {
    setNameOfGroup(event.target.value);
  };
  const handleChannelTypeChange = (event:any) => {
    setChannelType(event.target.value);
  };

  const handlePasswordChange = (event:any) => {
    setChannelPassword(event.target.value);
  };

  const handleCloseClick = () => {
    prop.setPopupParent((prev:any)=> {
      return ({...prev,display:'none'})
    });
  }

  return (
    <div className='popup' style={prop.popupParent}>
      <div className='add-group-popup'>
        <span className="close"  onClick={handleCloseClick}>&times;</span>
        <div className='add-group-avatar'>
          <img src='/src/assets/group-defaul-image.png'/>
        </div>
        <input type="text" placeholder='Group name' className='add-group-name' value={nameOfGroup} onChange={handleInputChange} />
        <h2>Channel Type:</h2>
        <div className='channel-types'>
          <label>
            <input
              type="radio"
              value="public"
              name="channel-type"
              checked={channelType === 'public'}
              onChange={handleChannelTypeChange}
            />
            Public
          </label>

          <label>
            <input
              type="radio"
              value="private"
              name="channel-type"
              checked={channelType === 'private'}
              onChange={handleChannelTypeChange}
            />
            Private
          </label>

          <label>
            <input
              type="radio"
              value="protected"
              name="channel-type"
              checked={channelType === 'protected'}
              onChange={handleChannelTypeChange}
            />
            Protected
          </label>
        </div>
        {(channelType == 'protected') &&
            <input
            type='password'
            placeholder='Password'
            className='protected-group'
            value={channelPassword}
            onChange={handlePasswordChange}
            />}
        <input type='submit' className='submit'  onClick={fetch}/>
      </div>
    </div>
  );
};

export default PopupCreatGroup;
