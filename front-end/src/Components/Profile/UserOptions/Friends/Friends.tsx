import { useEffect, useState } from 'react';
import './Friends.css'
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';

const Friend = () => {
    const [friends, setFriends] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { authUser } = useAuth();

    useEffect(() => {
        const fetchFriends = async () => {
            console.log(friends);
            const res = await axiosPrivate.get(`/friends/${authUser.userId}`);
            console.log(res.data);
            setFriends(res.data);
        }
        fetchFriends();
    }, []);


    return (
        <div>
            {friends.length > 0 && friends.map((friend) => (
                <Link to={`/user/${friend.userId}`} key={friend.userId} className='friend'>
                    <div className='user-avatar-name'>
                        <img src={`http://localhost:3000/avatar/${friend.avatar}`} className='avatar' />
                        <h4>{friend.name}</h4>
                    </div>
                    <div className='friend-buttons'>
                        <div className='friend-play-button'><img src='/src/assets/play.svg' /></div>
                        <div className='friend-message-button'><img src='/src/assets/message.svg' /></div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Friend;
