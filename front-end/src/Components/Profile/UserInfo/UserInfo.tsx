import UserAvatar from './UserAvatar/UserAvatar';
import UserProfile from './UserProfile/UserProfile';
import UserProfileButtons from './UserProfileButtons/UserProfileButtons';
import UserStats from './UserStats/UserStats';
import './UserInfo.css'


const UserInfo = ({ otherProfile }: any) => {
    return (
        <div className='user-info-container'>
            <UserAvatar />
            <UserProfile />
            {!otherProfile && <UserProfileButtons /> }
            <UserStats />
        </div>
    );
}

export default UserInfo;
