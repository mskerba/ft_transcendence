import UserAvatar from './UserAvatar/UserAvatar';
import UserProfile from './UserProfile/UserProfile';
import UserProfileButtons from './UserProfileButtons/UserProfileButtons';
import UserStats from './UserStats/UserStats';
import './UserInfo.css'
import { useAuth } from '../../../context/AuthContext';


const UserInfo = ({ user }: any) => {
    const { authUser }: any = useAuth();

    return (
        <div className='user-info-container'>
            <UserAvatar avatar={user.avatar} />
            <UserProfile username={user.name} level={user.level} />
            {authUser.userId !== user.userId && <UserProfileButtons user={user} /> }
            <UserStats user={user}/>
        </div>
    );
}

export default UserInfo;
