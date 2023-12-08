import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

const Member = (prop:any) => {

  function handleMoreInfClick(event:any) {
    // console.log(event)
    const { clientX, clientY } = event;
    prop.setDivPosition((prev:any) => 
                          {
                            let display = (prev.display == 'none')? 'flex' : 'none';
                            return{ x: clientX - 190,
                                    y: clientY - 165,
                                    display: display,
                                    i:1
                                  }
                          });
  }

  return (

    <div className='member-in-group'>
      <div className='avatar-name-in-grou-inf'>
        <img src="https://thispersondoesnotexist.com/" />
      </div>
      <div className='name-of-member-in-group'>
        <h3>abdelmounaim</h3>
        <p>Admin</p>
      </div>
      <span className="v-ellipsis"  onClick={handleMoreInfClick}>&#xFE19;</span>

    </div>
  );
}

const PopupGroupInf = (prop:any) => {

  const handleCloseClick = () => {
    prop.setPopupInfParent((prev:any)=> {
      return ({...prev,display:'none'})
    });
  };

  function handleMoreInfClick() {
    prop.setDivPosition((prev:any)=> {
                        if (prev.i == '1')
                          return{ ...prev, i: '2'}
                        else
                          return{...prev, display: 'none', i: '0'}
                  });
                }

  return (
    <>
      <div className='drop-down-menu'
          style={{ left: prop.divPosition.x, top: prop.divPosition.y, display: prop.divPosition.display}}>
            <ul>
              <li>Play</li>
              <li>Contact</li>
              <li>Mute</li>
              <li>Ban</li>
              <li>Block</li>
            </ul>
      </div>
      <div className='popup-inf' style={prop.popupInfParent} onClick={handleMoreInfClick}>
        <div className='popup-group-inf'>


          <div className="close-goup-inf"  onClick={handleCloseClick}>&#10799;</div>
          
          <div className='group-avatar-inf'>
            <img src="https://thispersondoesnotexist.com/" />
          </div>
          
          <div className='group-members-inf'>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
            <Member setDivPosition={prop.setDivPosition}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupGroupInf;
