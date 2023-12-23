import { useEffect, useState } from 'react';
import './UserProfileButtons.css'
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';

enum Friendship {
    friend,
    notFriend,
    received,
    sent,
}

const UserProfileButtons = ({ userId }: any) => {
    const [friendshipStatus, setFriendshipStatus] = useState('');
    const [requestId, setRequestId] = useState('');
    
    const axiosPrivate = useAxiosPrivate();



    const fetchFriendshipStatus = async () => {
        let res = await axiosPrivate.get(`/friendship-status/${userId}`);
        setFriendshipStatus(res.data);
        res = await axiosPrivate.get(`/friend-request-id/${userId}`);
        setRequestId(res.data);
        
    }

    useEffect(() => {
        fetchFriendshipStatus();
    }, [friendshipStatus]);







    return (
        <div className='user-profile-buttons-container'>
            {friendshipStatus == 'friend' &&
                <div className='user-profile-button'
                    onClick={async () => {
                        try {
                            await axiosPrivate.get(`unfriend/${userId}`);
                            setFriendshipStatus('not-friend');
                        } catch (error) { }
                    }}
                >
                    <img src='/src/assets/unfriend.svg' />
                    <img src='/src/assets/unfriend-hovered.svg' className='hovered' />
                </div>
            }
            {friendshipStatus == 'not-friend' &&
                <div className='user-profile-button'
                    onClick={async () => {
                        try {
                            const res = await axiosPrivate.get(`send-friend-request/${userId}`);
                            setFriendshipStatus('request-sent');
                            setRequestId(res.data.requestId);
                        } catch (error) { }
                    }}
                >
                    <img src='/src/assets/add-friend.svg' />
                    <img src='/src/assets/add-friend-hovered.svg' className='hovered' />
                </div>
            }
            {friendshipStatus == 'request-sent' &&
                <div className='user-profile-button'
                    onClick={async () => {
                        try {
                            await axiosPrivate.get(`cancel-friend-request/${requestId}`);
                            setFriendshipStatus('not-friend');
                        } catch (error) { }
                    }}
                >
                    <img src='/src/assets/friend-req-sent.svg' />
                    <img src='/src/assets/friend-req-sent-hovered.svg' className='hovered' />
                </div>
            }
            {friendshipStatus == 'request-received' &&
                <>
                    <div className='user-profile-button'
                    onClick={async () => {
                        try {
                            await axiosPrivate.get(`accept-friend-request/${requestId}`);
                            setFriendshipStatus('friend');
                        } catch (error) { }
                    }}
                    >
                        <img src='/src/assets/accept-request.svg' />
                        <img src='/src/assets/accept-request-hovered.svg' className='hovered' />
                    </div>
                    <div className='user-profile-button'
                    onClick={async () => {
                        try {
                            await axiosPrivate.get(`decline-friend-request/${requestId}`);
                            setFriendshipStatus('not-friend');
                        } catch (error) { }
                    }}
                    >
                        <img src='/src/assets/decline-request.svg' />
                        <img src='/src/assets/decline-request-hovered.svg' className='hovered' />
                    </div>
                </>
            }
            {friendshipStatus == 'friend' &&
                <div className='user-profile-button'>
                    <img src='/src/assets/message.svg' />
                    <img src='/src/assets/message-hovered.svg' className='hovered' />
                </div>
            }
            <div className='user-profile-button'>
                <img src='/src/assets/block.svg' />
                <img src='/src/assets/block-hovered.svg' className='hovered' />
            </div>
        </div>
    );
}

export default UserProfileButtons;
