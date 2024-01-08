
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';
import { useEffect, useState } from 'react';
import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [option, setOption] = useState(0);
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const  { userId }  = useParams();
    const { authUser }: any = useAuth();

    const handleStateChange = (option: number) => {
        setOption(option);
    };

    useEffect(() => {
        const test = async () => {
          try {
            const res = await axiosPrivate.get(`/user/${userId}`);
            setOption(0);
            if (res.status == 200) {
                setUser(res.data)
            }
        }
          catch (error) {  }
        }
        test();
    }, [userId]);

    return (
        user.avatar == undefined
        ? <></>
        : <div className='profile'>
            <section className='row-0'>
                <UserInfo user={user}/>
                <UserOptionsNavBar option={option} onStateChange={handleStateChange} otherProfile={user.userId === authUser.userId}/>
            </section>
            <section className='row-1'>
                <UserOptions option={option} user={user} onStateChange={setUser}/>
            </section>
        </div>
    );
};

export default Profile;

