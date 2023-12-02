import './ProfileNavBar.css'

const ProfileNavBar = () => {
    return (
        <nav className='navbar'>
            <div className='button'>Games</div>
            <div className='button'>Achievements</div>
            <div className='button'>Friends</div>
            <div className='active'>Friend Requests</div>
            <div className='button'>Blocked Users</div>
            <div className='button'>settings</div>
        </nav>
    );
}

export default ProfileNavBar;

