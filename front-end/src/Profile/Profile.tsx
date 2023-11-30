import React, { useState, useEffect } from 'react';
import './Profile.css'

const Profile = () => {

  return (
    <div className='profile'>
        <div className='header'>
            <div className='user-infos'>
                <img src="https://thispersondoesnotexist.com/"/>
                <h3>momeaizi</h3>
                <p><span>level</span> 11.75</p>
                <div className='infos'>
                    <div className='block'>
                        <span className='label'>Games</span>
                        <span className='value'>145</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Wins</span>
                        <span className='value'>127</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Losses</span>
                        <span className='value'>18</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Friends</span>
                        <span className='value'>96</span>
                    </div>
                </div>
            </div>
            <nav className='navbar'>
                <div className='button'>Games</div>
                <div className='button'>Friends</div>
                <div className='active'>Friend Requests</div>
                <div className='button'>Achievements</div>
                <div className='button'>settings</div>
                
            </nav>
        </div>
        <div className='footer'>
            <div className='box'>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                <div className='item'>
                    <h4>Hamid sahrawi lakher</h4>
                    <div className='buttons'>
                        <div className='confirm'>Confirm</div>
                        <div className='delete'>Delete</div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  );
};

export default Profile;
