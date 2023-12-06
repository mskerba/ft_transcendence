import FriendRequests from './UserOptions/FriendRequests/FriendRequests';
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';
import { useState } from 'react';

import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';

const Profile = () => {
    const [option, setOption] = useState(0);

    const handleStateChange = (option: number) => {
        setOption(option);
    };


    return (
        <div className='profile'>
            <section className='row-0'>
                <UserInfo />
                <UserOptionsNavBar option={option} onStateChange={handleStateChange}/>
            </section>
            <section className='row-1'>
                <UserOptions option={option} />
            </section>
        </div>
    );
};

export default Profile;

