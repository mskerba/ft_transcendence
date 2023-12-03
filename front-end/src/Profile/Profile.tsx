import FriendRequests from './UserOptions/FriendRequests/FriendRequests';
import './Profile.css'
import UserInfo from './UserInfo/UserInfo';

import UserOptionsNavBar from './UserOptionsNavBar/UserOptionsNavBar';
import UserOptions from './UserOptions/UserOptions';

const Profile = () => {
    return (
        <div className='profile'>
            <section className='row-0'>
                {/* <UserInfo /> */}
                <UserOptionsNavBar />
            </section>
            <section className='row-1'>
                <UserOptions />
            </section>
        </div>
    );
};

export default Profile;

