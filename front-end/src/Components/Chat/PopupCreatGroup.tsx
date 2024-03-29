// @ts-ignore
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';

const PopupCreatGroup = (prop:any) => {
  const [channelType, setChannelType] = useState('public');
  const [channelPassword, setChannelPassword] = useState('');
  const [nameOfGroup, setNameOfGroup] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const { authUser, socketRef}: any = useAuth();

  const fetch = async () => {
    try {
      const postGroup:any = {
        UserId: authUser.userId,//number
        TypeRoom: channelType, // protected , public, private
        // avarar: '',//link
        title: nameOfGroup, 
      };
      (channelType == 'protected') ? postGroup.password = channelPassword : '';
      let res;
      if (prop.RoomId === '') {
        res = await axiosPrivate.post("/chat", postGroup);
        if (res.data.success) {
          socketRef.current.emit('joinGroup', {group: res.data.roomId});
        }
      }
      else
      {
        postGroup.RoomId = prop.RoomId; 
        res = await axiosPrivate.post("chat/group/update", postGroup);
        prop.setRoomID('');
      }
      prop.setRefresh(1);
      
      prop.setShowDropdown(true);
      setTimeout(()=>prop.setShowDropdown(false), 3000);
      prop.setNotifAlert(()=>{return ({error:'success',msg:res.data.success})})
    }
    catch (error) { 
      prop.setShowDropdown(true);
      setTimeout(()=>prop.setShowDropdown(false), 3000);
      prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
    }

    handleCloseClick();
  }

  const handleInputChange = (event:any) => {
    setNameOfGroup(event.target.value);
  };
  const handleChannelTypeChange = (event:any) => {
    setChannelType(event.target.value);
    setChannelPassword('')
  };

  const handlePasswordChange = (event:any) => {
    setChannelPassword(event.target.value);
  };

  const handleCloseClick = () => {
    prop.setPopupParent((prev:any)=> {
      return ({...prev,display:'none'})
    });
    prop.setRoomID('');
    setChannelType('public');
    setChannelPassword('');
    setNameOfGroup('');
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
