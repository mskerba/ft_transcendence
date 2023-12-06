import React, { useState } from 'react';
import './chat.css';

const Popup = () => {
  const [channelType, setChannelType] = useState('Public'); // Default value for the selected channel type

  const handleChannelTypeChange = (event:any) => {
    setChannelType(event.target.value);
  };

  return (
    <div className='add-group-popup'>
      <div className='popup'>
        <span className="close">&times;</span>
        <div className='add-group-avatar'>
          <img src='src/assets/group-defaul-image.png'/>
        </div>
        <input type="text" placeholder='Group name' className='add-group-name' />
        <h3>Channel Type:</h3>
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
        {(channelType == 'Protected') && <input type='password' placeholder='Password'/>}
        {/* <p>The channel Type is: {}</p> */}
      </div>
    </div>
  );
};

export default Popup;
