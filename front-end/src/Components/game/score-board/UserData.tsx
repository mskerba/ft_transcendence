import React from 'react'
import '../Game.css'

function UserData(prop:any) {
  const imgStyle:any = {
    'borderRadius': '50%',
    width: '50px',
    height: '50px',
  }
  
  return (
    <div className={prop.className}>
        <div className='player--image'>
          <img src={prop.image} alt={prop.className} style={imgStyle}/>
        </div>
        <div className='name'>
          <p>{prop.userName}</p>
        </div>
    </div>
  )
}

export default UserData
