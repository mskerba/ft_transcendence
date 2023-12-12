import './UserOptionsNavBar.css'

const UserOptionsNavBar = ({option, onStateChange}: any) => {
    const handleButtonClick = (active: number) => {
        option = active;
        onStateChange(active);
      };
    return (
        <nav className='user-options-navbar'>
            <div className={`user-options-navbar-button ${option == 0 ? 'active' : ''}`}
                onClick={() => handleButtonClick(0)}
            >
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Games</span>
            </div>
            <div className={`user-options-navbar-button ${option == 1 ? 'active' : ''}`}
                onClick={() => handleButtonClick(1)}
            >
                <img src='src/assets/achievements.svg'/>
                <img src='src/assets/achievements-hovered.svg' className='hovered'/>
                <span>Achievements</span>
            </div>
            <div className={`user-options-navbar-button ${option == 2 ? 'active' : ''}`}
                onClick={() => handleButtonClick(2)}
            >
                <img src='src/assets/friends.svg'/>
                <img src='src/assets/friends-hovered.svg' className='hovered'/>
                <span>Friends</span>
            </div>
            <div className={`user-options-navbar-button ${option == 3 ? 'active' : ''}`}
                onClick={() => handleButtonClick(3)}
            >
                <img src='src/assets/friend-requests.svg'/>
                <img src='src/assets/friend-requests-hovered.svg' className='hovered'/>
                <span>Friend Requests</span>
            </div>
            <div className={`user-options-navbar-button ${option == 4 ? 'active' : ''}`}
                onClick={() => handleButtonClick(4)}
            >
                <img src='src/assets/blocked.svg'/>
                <img src='src/assets/blocked-hovered.svg' className='hovered'/>
                <span>Blocked Users</span>
            </div>
            <div className={`user-options-navbar-button ${option == 5 ? 'active' : ''}`}
                onClick={() => handleButtonClick(5)}
            >
                <img src='src/assets/settings.svg'/>
                <img src='src/assets/settings-hovered.svg' className='hovered'/>
                <span>settings</span>
            </div>
        </nav>
    );
}

export default UserOptionsNavBar;

