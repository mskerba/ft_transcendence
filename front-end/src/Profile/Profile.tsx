import FriendRequests from './FriendRequests/FriendRequests';
import './Profile.css'
import ProfileNavBar from './navbar/ProfileNavBar';

const Profile = () => {
    var isFriend: Boolean = true;
  return (
    <div className='profile'>
        <div className='header'>
            <div className='user-infos'>
                <img src="https://thispersondoesnotexist.com/" className='user-avatar'/>
                <h3>momeaizi</h3>
                <p><span>level</span> 11.75</p>
                <div className='user-profile-buttons-container'>
                    { isFriend ? (
                        <div className='unfriend-button'><img src='src/assets/unfriend.svg'/></div>
                    ) : (
                        <div className='add-friend-button'><img src='src/assets/add-friend.svg'/></div>
                    )}
                    <div className='send-message-button'><img src='src/assets/message.svg'/></div>
                    <div className='block-button'><img src='src/assets/block.svg'/></div>
                </div>
                <div className='infos'>
                    <div className='block'>
                        <span className='label'>Games</span>
                        <span className='value'>145</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Wins</span>
                        <span className='value'>127</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Losses</span>
                        <span className='value'>18</span>
                    </div>
                    <div className='block'>
                        <span className='label'>Friends</span>
                        <span className='value'>96</span>
                    </div>
                </div>
            </div>
           <ProfileNavBar/>
        </div>
        <div className='footer'>
            <div className='box'>
                <FriendRequests/>
            </div>
        </div>
    </div>
  );
};

export default Profile;

