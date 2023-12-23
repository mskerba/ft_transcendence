import React, { useState, useEffect, useRef } from 'react';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
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
  }


  return (

    <div className='member-in-group'>
      <div className='avatar-name-in-grou-inf'>
        <img src={Avatar} />
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
  const [updateGroup, setUpdateGroup] = useState(false)

  const axiosPrivate = useAxiosPrivate();
  const handleCloseClick = () => {
    prop.setPopupInfParent((prev:any)=> {
      return ({...prev,display:'none'})
    });
  };


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosPrivate.get(`/chat/about/${prop.convInf.convId}/0`);
        const listeOfData:any = Object.values(res?.data);
        const userRole = listeOfData.pop();
        setRole(userRole.UserRole);
        setAllMember(listeOfData);
      }
      catch (error) { console.log("error-->", error)}
    }
    if(prop.convInf.convId !== '')
      fetch();
  }, [prop.convInf.convId]);



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
   
    handleMoreInfClick();
  }
    
  async function handleKick (){
    const res = await axiosPrivate.post("/chat/group/kick", {
      roomId:prop.convInf.convId,
      senderId: 0,
      userId: memberSelected,

    });
    handleMoreInfClick();
  }

  function handleAddMemberClick (){
    console.log('add');
  }

  function handleRemoveGroupClick (){

  }

  const closeMute = () => setMutePopUp(false)

  const closeupdate = () => {
    setUpdateGroup(false);
  };

  async function sendMute() {

    setMutePopUp(false)
    if (muteTime != 'none')
    {

      const res = await axiosPrivate.post("/chat/group/mute", {
        roomId: prop.convInf.convId,
        senderId: 0,
        userId: parseInt(memberSelected),
        numberHour: parseInt(muteTime)
      });
    }
  }

  async function handleLeaveGroupClick() {
    handleCloseClick();
    const res = await axiosPrivate.get(`/chat/leave/${prop.convInf.convId}/0`);
  }

  function handleMuteTimeChange(event:any) {
    setMuteTime(event.target.value);
  }

  function handleUpdateGroupClick() {
    handleCloseClick();
    setUpdateGroup(true);
  }

  async function sendUpdateGroup() {
    
  }

  return (
    <>
      <Modal
        isOpen={mutePopUp}
        className='pupup-mute'
        onRequestClose={closeMute}
        shouldCloseOnOverlayClick={true}
        overlayClassName="popup-overlay"
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
        onRequestClose={closeupdate} // This callback function is invoked when the overlay is clicked.
        shouldCloseOnOverlayClick={true} // Allows the modal to close when the overlay is clicked.
        overlayClassName="popup-overlay"
      >
        <h4>username:</h4>
        <div></div>
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

          <div className="goup-remove-add"  >
            {(Role !== 'member')&&
            <>
              <img src='src/assets/add-user-group.svg' className='add-member-group' onClick={handleAddMemberClick}/>
              <img src='src/assets/update-group.svg' className='update-group' onClick={handleUpdateGroupClick}/>
            </>}
            {(Role == 'owner')&&<img src='src/assets/remove-group.svg' className='remove-group' onClick={handleRemoveGroupClick}/>}
            <img src='src/assets/leave-group.svg' className='leave-group' onClick={handleLeaveGroupClick}/>
          </div>
          
          <div className='group-members-inf'>
          <>
            {allMember.map((element:any, index:number) => (
              <Member key={index} setDivPosition={prop.setDivPosition} setMemberSelected={setMemberSelected} {...element} userRole={Role} setUserSelectedRole={setUserSelectedRole}/>
            ))}
          </>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupGroupInf;
