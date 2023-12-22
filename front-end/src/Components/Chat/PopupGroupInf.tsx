import React, { useState, useEffect, useRef } from 'react';
import  useAxiosPrivate  from '../../hooks/UseAxiosPrivate';
import './chat.css';

const Member = (prop:any) => {
  const {Id, Role, Name, Avatar} = prop;
  function handleMoreInfClick(event:any) {
    const { clientX, clientY } = event;
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
  const [Role,setRole] = useState('');
  const [userSelectedRole,setUserSelectedRole] = useState('');

  const [allMember, setAllMember] = useState([]);

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

  
  async function handleMute (){
   
    handleMoreInfClick();
  }

  async function handleBan (){
   
    handleMoreInfClick();
  }
    
  async function handleKick (){
    const res = await axiosPrivate.post("/chat/group/kick", {

    });
    handleMoreInfClick();
  }

  return (
    <>
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
          
          <div className='group-members-inf'>
          <>
            {allMember.map((element:any, index:number) => (
              <Member key={index} setDivPosition={prop.setDivPosition} {...element} userRole={Role} setUserSelectedRole={setUserSelectedRole}/>
            ))}
          </>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupGroupInf;
