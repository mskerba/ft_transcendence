import { useEffect, useState } from 'react';
import './Blocked.css'
import { useAuth } from '../../../../context/AuthContext';
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';

const Blocked = () => {
    const [blockedUsers, setbBlockedUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { authUser }: any = useAuth();

    const fetchBlockedUsers = async () => {
        const res = await axiosPrivate.get('/blockedUsers');
        setbBlockedUsers(res.data);
    }

    useEffect(() => {
        fetchBlockedUsers();
    }, []);
    return (
        <div>
            {blockedUsers.length > 0 && blockedUsers.map((blocked) => (
                <div key={blocked.blockId} className='blocked'>
                    <div className='user-avatar-name'>
                        <img src={`http://10.14.4.10:3000/avatar/${blocked.avatar}`} className='avatar' />
                        <h4>{blocked.name}</h4>
                    </div>
                    <div className='blocked-buttons'
                        onClick={async () => {
                            try {
                                await axiosPrivate.get(`unblock/${blocked.blockId}`);
                                fetchBlockedUsers();

                            } catch (error) { }
                        }}
                    >
                        <div className='blocked-unblock-button'><img src='/src/assets/unblock.svg' /></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Blocked;
