import UserAvatar from './UserAvatar/UserAvatar';
import UserProfile from './UserProfile/UserProfile';
import UserProfileButtons from './UserProfileButtons/UserProfileButtons';
import UserStats from './UserStats/UserStats';
import './UserInfo.css'
import { useAuth } from '../../../context/AuthContext';


const UserInfo = ({ user }: any) => {
    const { authUser } = useAuth();

    return (
        <div className='user-info-container'>
            <UserAvatar avatar={user.avatar} />
            <UserProfile username={user.name} />
            {authUser.userId !== user.userId && <UserProfileButtons /> }
            <UserStats />
        </div>
    );
}

export default UserInfo;
