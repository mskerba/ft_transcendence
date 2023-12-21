import { useState } from 'react';
import './UserProfileButtons.css'

enum Friendship {
    friend,  
    notFriend,
    received,
    sent,
}

const UserProfileButtons = () => {
    var [friendshipStatus, setFriendshipStatus] = useState<Friendship>(Friendship.received)

    const handleClick = (status: Friendship) => {
        setFriendshipStatus(status);
    };
    return (
        <div className='user-profile-buttons-container'>
            {friendshipStatus == Friendship.friend &&
                <div className='user-profile-button'
                    onClick={() => handleClick(Friendship.notFriend)}
                >
                    <img src='/src/assets/unfriend.svg'/>
                    <img src='/src/assets/unfriend-hovered.svg' className='hovered'/>
                </div>
            }
            {friendshipStatus == Friendship.notFriend &&
                <div className='user-profile-button'
                    onClick={() => handleClick(Friendship.sent)}
                >
                    <img src='/src/assets/add-friend.svg'/>
                    <img src='/src/assets/add-friend-hovered.svg' className='hovered'/>
                </div>
            }
            {friendshipStatus == Friendship.sent &&
                <div className='user-profile-button'
                    onClick={() => handleClick(Friendship.notFriend)}
                >
                    <img src='/src/assets/friend-req-sent.svg'/>
                    <img src='/src/assets/friend-req-sent-hovered.svg' className='hovered'/>
                </div>
            }
            {friendshipStatus == Friendship.received &&
                <>
                    <div className='user-profile-button'
                        onClick={() => handleClick(Friendship.friend)}
                    >
                        <img src='/src/assets/accept-request.svg'/>
                        <img src='/src/assets/accept-request-hovered.svg' className='hovered'/>
                    </div>
                    <div className='user-profile-button'
                        onClick={() => handleClick(Friendship.notFriend)}
                    >
                        <img src='/src/assets/decline-request.svg'/>
                        <img src='/src/assets/decline-request-hovered.svg' className='hovered'/>
                    </div>
                </>
            }
            {friendshipStatus == Friendship.friend && 
                <div className='user-profile-button'>
                    <img src='/src/assets/message.svg'/>
                    <img src='/src/assets/message-hovered.svg' className='hovered'/>
                </div>
            }
            <div className='user-profile-button'>
                <img src='/src/assets/block.svg'/>
                <img src='/src/assets/block-hovered.svg' className='hovered'/>
            </div>
        </div>
    );
}

export default UserProfileButtons;
