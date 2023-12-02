import './UserOptionsNavBar.css'

const ProfileNavBar = () => {
    return (
        <nav className='user-options-navbar'>
            <div className='user-options-navbar-button'>Games</div>
            <div className='user-options-navbar-button'>Achievements</div>
            <div className='user-options-navbar-button'>Friends</div>
            <div className='user-options-navbar-button active'>Friend Requests</div>
            <div className='user-options-navbar-button'>Blocked Users</div>
            <div className='user-options-navbar-button'>settings</div>
        </nav>
    );
}

export default ProfileNavBar;

