import React, { useState, useEffect, useRef } from 'react';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import PopupCreatGroup from './PopupCreatGroup';
import Modal from 'react-modal';
import './chat.css';

const Member = (prop:any) => {
  const {Id, Role, Name, Avatar} = prop;
  function handleMoreInfClick(event:any) {
    const { clientX, clientY } = event;
    prop.setMemberSelected(Id);
    prop.setUserSelectedRole(Role);
    prop.setDivPosition((prev:any) => 
                          {
                            let display = (prev.display == 'none')? 'flex' : 'none';
                            let top =  (prop.userRole == 'member' || Role == 'owner')? 80 : 165; 
                            return{ x: clientX - 190,
                                    y: clientY - top,
                                    display: display,
                                    i:1
                                  }
                          });
    prop.setRefresh(2);
  }


  return (

    <div className='member-in-group'>
      <div className='avatar-name-in-grou-inf'>
        <img src={`http://localhost:3000/avatar/${Avatar}`} />
      </div>
      <div className='name-of-member-in-group'>
        <h3>{Name}</h3>
        <p>{Role}</p>
      </div>
      <span className="v-ellipsis"  onClick={handleMoreInfClick}>&#xFE19;</span>

    </div>
  );
}

const PopupGroupInf = (prop:any) => {
  const [memberSelected, setMemberSelected] :any = useState('')
  const [Role,setRole] = useState('');
  const [userSelectedRole,setUserSelectedRole] = useState('');
  const [mutePopUp, setMutePopUp] :any = useState(false);
  const [allMember, setAllMember] = useState([]);
  const [muteTime, setMuteTime] = useState('1');
  const [updateGroup, setUpdateGroup] = useState(false);
  const [addUsernameGroup, setAddUsernameGroup] = useState('');
  const [addRoleNewUser, setAddRoleNewUser] = useState('member');
  const axiosPrivate = useAxiosPrivate();


  const handleCloseClick = () => {
    prop.setPopupInfParent((prev:any)=> {
      return ({...prev,display:'none'})
    });
    prop.setRoomID(prop.convInf.convId);
  };


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosPrivate.get(`/chat/about/${prop.convInf.convId}`);
        const listeOfData:any = Object.values(res?.data);
        const userRole = listeOfData.pop();
        setRole(userRole.UserRole);
        setAllMember(listeOfData);
      }
      catch (error) {
        prop.setShowDropdown(true);
        setTimeout(()=>prop.setShowDropdown(false), 3000);
        prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
      }
    }
    if(prop.convInf.convId !== '')
      fetch();
    prop.setRefresh(0);
  }, [prop.convInf.convId,prop.refresh]);


  function handleMoreInfClick() {
    prop.setDivPosition((prev:any)=> {
                        if (prev.i == '1')
                          return{ ...prev, i: '2'}
                        else
                          return{...prev, display: 'none', i: '0'}
                  });
  }
    
  async function handlePlay (){
   
    handleMoreInfClick();
  }

  async function handleContact (){
   
    handleMoreInfClick();
  }

  
   function handleMute (){
    handleMoreInfClick();
    setMutePopUp(true);
   
  }

  async function handleBan (){
    const res = await axiosPrivate.post("/chat/group/ban", {
      roomId:prop.convInf.convId,
      senderId: 0,
      userId: memberSelected,

    });
   
    prop.setRefresh(1);
    prop.setShowDropdown(true);
    setTimeout(()=>prop.setShowDropdown(false), 3000);
    prop.setNotifAlert(()=>{return ({error:'info',msg:res.data.success})})
    handleMoreInfClick();
  }
    
  async function handleKick (){
    const res = await axiosPrivate.post("/chat/group/kick", {
      roomId:prop.convInf.convId,
      senderId: 0,
      userId: memberSelected,

    });
    prop.setRefresh(1);
    prop.setShowDropdown(true);
    setTimeout(()=>prop.setShowDropdown(false), 3000);
    prop.setNotifAlert(()=>{return ({error:'info',msg:res.data.success})})
    handleMoreInfClick();
  }

  async function handleUpdateGroupClick (){
    handleCloseClick();
    prop.setPopupParent((prev:any) => {
      return ({
        ...prev,
        display:'flex',
      })
    });
  }

  async function handleRemoveGroupClick (){
    const res = await axiosPrivate.get(`/chat/remove/${prop.convInf.convId}`);
    prop.setRefresh(1);
    handleCloseClick();
    prop.setConvInf({
      Avatar : "",
      Name: "",
      convId : "",
      group: "",
      id:""
    });
    prop.setShowDropdown(true);
    setTimeout(()=>prop.setShowDropdown(false), 3000);
    prop.setNotifAlert(()=>{return ({error:'warning',msg:res.data.success})})
    if (innerWidth <=925)
      prop.setShow(1);
  }

  const closeMute = () => setMutePopUp(false)

  const closeupdate = () => {
    setUpdateGroup(false);
  };

  async function sendMute() {

    setMutePopUp(false)
    if (muteTime != 'none')
    {
      try {

        const res = await axiosPrivate.post("/chat/group/mute", {
          roomId: prop.convInf.convId,
          senderId: 0,
          userId: parseInt(memberSelected),
          numberHour: parseInt(muteTime)
        });
        
        prop.setShowDropdown(true);
        setTimeout(()=>prop.setShowDropdown(false), 3000);
        prop.setNotifAlert(()=>{return ({error:'warning',msg:res.data.success})})
      } catch(error)
      {
        prop.setShowDropdown(true);
        setTimeout(()=>prop.setShowDropdown(false), 3000);
        prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
      }
    }
  }

  async function handleLeaveGroupClick() {
    handleCloseClick();
    const res = await axiosPrivate.get(`/chat/leave/${prop.convInf.convId}`);

    prop.setRefresh(1);
    prop.setConvInf({
      Avatar : "",
      Name: "",
      convId : "",
      group: "",
      id:""
    });

    prop.setShowDropdown(true);
    setTimeout(()=>prop.setShowDropdown(false), 3000);
    prop.setNotifAlert(()=>{return ({error:'warning',msg:res.data.success})})
    if (innerWidth <=925)
      prop.setShow(1);
  }

  function handleMuteTimeChange(event:any) {
    setMuteTime(event.target.value);
  }

  function handleAddMemberClick() {
    handleCloseClick();
    setUpdateGroup(true);
  }

  async function sendUpdateGroup() {

    closeupdate();
    let post = {
      roomId: prop.convInf.convId,
      userName: addUsernameGroup,
      roleName: addRoleNewUser
    };
    try {

      const res = await axiosPrivate.post(`/chat/group/add`, post);

    prop.setShowDropdown(true);
    setTimeout(()=>prop.setShowDropdown(false), 3000);
    prop.setNotifAlert(()=>{return ({error:'success',msg:res.data.success})})
    }
    catch {
      prop.setShowDropdown(true);
      setTimeout(()=>prop.setShowDropdown(false), 3000);
      prop.setNotifAlert(()=>{return ({error:'error',msg:error.response.data.message[0]})})
    }
    setAddUsernameGroup('');
    prop.setRefresh(1);
  }

  const handleAddUsernameChange = (event:any) => setAddUsernameGroup(event.target.value);
  const handleChannelMemberRole = (event:any) => setAddRoleNewUser(event.target.value);

  return (
    <>
      <Modal
        isOpen={mutePopUp}
        className='pupup-mute'
        onRequestClose={closeMute}
        >
        <h4>Mute User</h4>
        <div className='color-text-mute-popup'>
        <label>
            <input
              type="radio"
              value="none"
              name="mute-type"
              checked={muteTime === 'none'}
              onChange={handleMuteTimeChange}
            />
            none
          </label>
          <label>
            <input
              type="radio"
              value="1"
              name="mute-type"
              checked={muteTime === '1'}
              onChange={handleMuteTimeChange}
            />
            1h
          </label>
          <label>
            <input
              type="radio"
              value='2'
              name="mute-type"
              checked={muteTime === '2'}
              onChange={handleMuteTimeChange}
            />
            2h
          </label>
          <label>
            <input
              type="radio"
              value="4"
              name="mute-type"
              checked={muteTime === '4'}
              onChange={handleMuteTimeChange}
            />
            4h
          </label>

          <label>
            <input
              type="radio"
              value="8"
              name="mute-type"
              checked={muteTime === '8'}
              onChange={handleMuteTimeChange}
            />
            8h
          </label>
        </div>
        <input type='submit' className='submit'  onClick={sendMute}/>
      </Modal>

      <Modal
        isOpen={updateGroup}
        className='update-group-popup'
        onRequestClose={closeupdate} 
      >
        <h4>username:</h4>
        <input
          type='text'
          placeholder='add Username'
          className='update-group-input'
          value={addUsernameGroup}
          onChange={handleAddUsernameChange}
        />
        <div className='role-new-user'>
        <label>
            <input
              type="radio"
              value="member"
              name="rool"
              checked={addRoleNewUser === 'member'}
              onChange={handleChannelMemberRole}
            />
            Member
          </label>

          <label>
            <input
              type="radio"
              value="admin"
              name="rool"
              checked={addRoleNewUser === 'admin'}
              onChange={handleChannelMemberRole}
            />
            Admin
          </label>
        </div>
        <input type='submit' className='submit-add-group' onClick={sendUpdateGroup}/>
      </Modal>

      
      <div className='drop-down-menu'
          style={{ left: prop.divPosition.x, top: prop.divPosition.y, display: prop.divPosition.display}}>
            <ul>
              <li onClick={handlePlay}>Play</li>
              <li onClick={handleContact}>Contact</li>
              {
                (Role !== 'member' && userSelectedRole != 'owner') &&
                <>
                  <li onClick={handleMute}>Mute</li>
                  <li onClick={handleBan}>Ban</li>
                  <li onClick={handleKick}>Kick</li>
                </> 
              }
            </ul>
      </div>

      <div className='popup-inf' style={prop.popupInfParent} onClick={handleMoreInfClick}>
        <div className='popup-group-inf'>


          <div className="close-goup-inf"  onClick={handleCloseClick}>&#10799;</div>

          
          <div className='group-avatar-inf'>
            <img src={prop.convInf.Avatar} />
          </div>

          <div className="group-remove-add"  >
            {(Role !== 'member')&&
            <>
              <div className='div-add-member-group'><img src='src/assets/add-user-group.svg' className='add-member-group' onClick={handleAddMemberClick}/></div>
              <div className='div-update-group'><img src='src/assets/update-group.svg' className='update-group' onClick={handleUpdateGroupClick}/></div>
            </>}
            {(Role == 'owner')&&<div className='div-remove-group'><img src='src/assets/remove-group.svg' className='remove-group' onClick={handleRemoveGroupClick}/></div>}
            <div className='div-leave-group'><img src='src/assets/leave-group.svg' className='leave-group' onClick={handleLeaveGroupClick}/></div>
          </div>
          
          <div className='group-members-inf'>
          <>
            {allMember.map((element:any, index:number) => (
              <Member key={index} setRefresh={prop.setRefresh}  setDivPosition={prop.setDivPosition} setMemberSelected={setMemberSelected} {...element} userRole={Role} setUserSelectedRole={setUserSelectedRole}/>
            ))}
          </>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupGroupInf;
