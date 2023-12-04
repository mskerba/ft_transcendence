import { useState } from 'react';
import './UserOptionsNavBar.css'

const UserOptionsNavBar = () => {
    var [active, setActive] = useState<number>(0)

    const handleClick = (index: number) => {
        setActive(index);
    };
    return (
        <nav className='user-options-navbar'>
            <div className={active == 0 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(0)}
            >
                <img src='src/assets/games.svg'/>
                <img src='src/assets/games-hovered.svg' className='hovered'/>
                <span>Games</span>
            </div>
            <div className={active == 1 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(1)}
            >
                <img src='src/assets/achievements.svg'/>
                <img src='src/assets/achievements-hovered.svg' className='hovered'/>
                <span>Achievements</span>
            </div>
            <div className={active == 2 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(2)}
            >
                <img src='src/assets/friends.svg'/>
                <img src='src/assets/friends-hovered.svg' className='hovered'/>
                <span>Friends</span>
            </div>
            <div className={active == 3 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(3)}
            >
                <img src='src/assets/friend-requests.svg'/>
                <img src='src/assets/friend-requests-hovered.svg' className='hovered'/>
                <span>Friend Requests</span>
            </div>
            <div className={active == 4 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(4)}
            >
                <img src='src/assets/blocked.svg'/>
                <img src='src/assets/blocked-hovered.svg' className='hovered'/>
                <span>Blocked Users</span>
            </div>
            <div className={active == 5 ? 'user-options-navbar-button active' : 'user-options-navbar-button'}
                onClick={() => handleClick(5)}
            >
                <img src='src/assets/settings.svg'/>
                <img src='src/assets/settings-hovered.svg' className='hovered'/>
                <span>settings</span>
            </div>
        </nav>
    );
}

export default UserOptionsNavBar;

