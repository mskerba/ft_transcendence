import UserAvatar from './UserAvatar/UserAvatar';
import UserProfile from './UserProfile/UserProfile';
import UserProfileButtons from './UserProfileButtons/UserProfileButtons';
import UserStats from './UserStats/UserStats';
import './UserInfo.css'


const UserInfo = () => {
    return (
        <div className='user-info-container'>
            <UserAvatar />
            <UserProfile />
            <UserProfileButtons />
            <UserStats />
        </div>
    );
}

export default UserInfo;
