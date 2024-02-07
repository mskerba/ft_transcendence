
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';
import { useEffect, useState } from 'react';
import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const [option, setOption] = useState(0);
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const { userId }: any = useParams();
    const { authUser }: any = useAuth();
    const navigate = useNavigate();


    const handleStateChange = (option: number) => {
        setOption(option);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosPrivate.get(`/user/${userId}`);
                setOption(0);
                if (res.status == 200) {
                    setUser(res.data)
                }
            }
            catch (err) {
                toast.error("This content isn\'t available right now");
                navigate('/');
            }
        }
        if (authUser.blockList.includes(Number(userId)) === false) {
            fetchUser();
        } else {
            toast.error('you are not authorized to access this page');
            navigate('/');
        }
    }, [userId]);

    return (
        user.avatar == undefined
            ? <></>
            : <div className='profile'>
                <section className='row-0'>
                    <UserInfo user={user} />
                    <UserOptionsNavBar option={option} onStateChange={handleStateChange} otherProfile={user.userId === authUser.userId} />
                </section>
                <section className='row-1'>
                    <UserOptions option={option} user={user} onStateChange={setUser} />
                </section>
            </div>
    );
};

export default Profile;

