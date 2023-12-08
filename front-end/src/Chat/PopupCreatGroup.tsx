import React, { useState, useRef } from 'react';

import './chat.css';

const PopupCreatGroup = (prop:any) => {
  const [channelType, setChannelType] = useState('Public');
  const [channelPassword, setChannelPassword] = useState('');



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
          <img src='src/assets/group-defaul-image.png'/>
        </div>
        <input type="text" placeholder='Group name' className='add-group-name' />
        <h2>Channel Type:</h2>
        <div className='channel-types'>
          <label>
            <input
              type="radio"
              value="Public"
              name="channel-type"
              checked={channelType === 'Public'}
              onChange={handleChannelTypeChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              value="Private"
              name="channel-type"
              checked={channelType === 'Private'}
              onChange={handleChannelTypeChange}
            />
            Private
          </label>
          <label>
            <input
              type="radio"
              value="Protected"
              name="channel-type"
              checked={channelType === 'Protected'}
              onChange={handleChannelTypeChange}
            />
            Protected
          </label>
        </div>
        {(channelType == 'Protected') &&
            <input
            type='password'
            placeholder='Password'
            className='protected-group'
            value={channelPassword}
            onChange={handlePasswordChange}
            />}
        <input type='submit' className='submit'/>
      </div>
    </div>
  );
};

export default PopupCreatGroup;
