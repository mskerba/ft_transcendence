import { useEffect, useState } from 'react';
import './Friends.css'
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../context/AuthContext';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Game from "../../../game/Game";
import { useNavigate } from 'react-router-dom';

const Friend = ({ userId }: any) => {
    const [friends, setFriends] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { authUser, socketRef, setRandomKey, setConvInf }: any = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            const res = await axiosPrivate.get(`/friends/${userId}`);
            setFriends(res.data);
        }
        fetchFriends();
    }, []);

    const handlePlayFreindClick = (userId: number) => {
        const prefix = 'privateGame_';
        const timestamp = Date.now().toString();
        const randomPart = Math.random().toString(36).substring(2, 8); // Adjust the length as needed
        const generatedName = `${prefix}${timestamp}_${randomPart}`;

        setRandomKey(generatedName);
        socketRef.current.emit("createPrivateGame", { userId, gameID: generatedName })
        navigate('/game');
    }



    return (
        <div>
            {friends.length > 0 && friends.map((friend) => (
                <div key={friend.userId} className='friend'>
                    <Link to={`/user/${friend.userId}`} className='user-avatar-name'>
                        <img src={`http://10.14.5.10:3000/avatar/${friend.avatar}`} className='avatar' />
                        <h4>{friend.name}</h4>
                    </Link>
                    {userId === authUser.userId &&
                        <div className='friend-buttons'>
                            <div className='friend-play-button' onClick={() => handlePlayFreindClick(friend.userId)}><img src='/src/assets/play.svg' /></div>
                            <div className='friend-message-button'>
                                <img src='/src/assets/message.svg' 
                                onClick={async () => {
                                    try {
                                        const res = await axiosPrivate.get(`/chat/check-or-create/${friend.userId}`);
                                        setConvInf({
                                            Avatar : friend.avatar,
                                            Name: friend.name,
                                            convId : res?.data?.conversationId,
                                            group: "",
                                            Id: friend.userId,
                                            status: friend.status,
                                        });
                                        navigate('/chat');
                                    } catch (error) { }
                                }}
                                />
                            </div>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
}

export default Friend;
