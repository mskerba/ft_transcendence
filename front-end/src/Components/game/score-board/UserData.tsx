// @ts-ignore
import React from 'react'
import '../Game.css'

function UserData(prop:any) {

  return (
    <div className={prop.className}>
        <div className='player--image'>
          <img src={prop.image} alt={prop.className}/>
        </div>
        <div className='name'>
          <p>{prop.userName}</p>
        </div>
    </div>
  )
}

export default UserData
