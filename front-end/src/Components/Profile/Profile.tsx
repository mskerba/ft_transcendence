import FriendRequests from './UserOptions/FriendRequests/FriendRequests';
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';
import { useEffect, useState } from 'react';

import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';
// import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const [option, setOption] = useState(0);
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const  userId  = 1;
    const { authUser } = useAuth();

    const handleStateChange = (option: number) => {
        setOption(option);
    };

    useEffect(() => {
        const test = async () => {
        //   try {
        //     const res = await axiosPrivate.get(`/user/${userId}`);
            // if (res.status == 200) {
                setUser(authUser)
            // }
        // }
        //   catch (error) {  }
        }
        test();
    }, []);

    return (
        !user
        ? <></>
        : <div className='profile'>
            <section className='row-0'>
                <UserInfo user={user}/>
                <UserOptionsNavBar option={option} onStateChange={handleStateChange} otherProfile={user.userId === authUser.userId}/>
            </section>
            <section className='row-1'>
                <UserOptions option={option} />
            </section>
        </div>
    );
};

export default Profile;

