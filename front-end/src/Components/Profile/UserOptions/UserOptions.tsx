import Achievement from './Achievements/Achievements';
import Blocked from './Blocked/Blocked';
import FriendRequest from './FriendRequests/FriendRequests';
import Friend from './Friends/Friends';
import Game from './Games/Games';
import Settings from './Settings/Settings';
import './UserOptions.css'

const UserOptions = ({ option, user, onStateChange }: any) => {
    return (
        <div className='user-options-container'>
            {option == 0 && <Game userId={user.userId}/>}
            {option == 1 && <Achievement />}
            {option == 2 && <Friend userId={user.userId}/>}
            {option == 3 && <FriendRequest />}
            {option == 4 && <Blocked />}
            {option == 5 && <Settings user={user} onStateChange={onStateChange} />}
        </div>
    );
}

export default UserOptions;
