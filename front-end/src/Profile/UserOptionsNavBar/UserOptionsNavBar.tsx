import './UserOptionsNavBar.css'

const UserOptionsNavBar = () => {
    return (
        <nav className='user-options-navbar'>
            <div className='user-options-navbar-button'>
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Games</span>
            </div>
            <div className='user-options-navbar-button'>
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Achievements</span>
            </div>
            <div className='user-options-navbar-button'>
                <img src='src/assets/friends.svg'/>
                <img src='src/assets/friends-hovered.svg' className='hovered'/>
                <span>Friends</span>
            </div>
            <div className='user-options-navbar-button actived'>
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Friend Requests</span>
            </div>
            <div className='user-options-navbar-button'>
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Blocked Users</span>
            </div>
            <div className='user-options-navbar-button'>
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>settings</span>
            </div>
        </nav>
    );
}

export default UserOptionsNavBar;

