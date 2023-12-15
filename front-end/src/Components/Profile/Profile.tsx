import FriendRequests from './UserOptions/FriendRequests/FriendRequests';
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';
import { useEffect, useState } from 'react';

import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';
import UserList from '../../userList';

const Profile = () => {
    const [option, setOption] = useState(0);

    const handleStateChange = (option: number) => {
        setOption(option);
    };

    return (
        <div className='profile'>
            <section className='row-0'>
                <UserInfo />
                <UserOptionsNavBar option={option} onStateChange={handleStateChange} otherProfile={true}/>
            </section>
            <section className='row-1'>
                <UserOptions option={option} />
            </section>
        </div>
    );
};

export default Profile;

