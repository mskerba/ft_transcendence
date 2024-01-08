import './UserStats.css'

const UserStats = ({ user }: any) => {
    return (
        <div className='user-stats-container'>
            <div className='user-stats'>
                <span className='user-stats-label'>Games</span>
                <span className='user-stats-value'>{user.games}</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Wins</span>
                <span className='user-stats-value'>{user.wins}</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Losses</span>
                <span className='user-stats-value'>{user.losses}</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Friends</span>
                <span className='user-stats-value'>{user.friends}</span>
            </div>
        </div>
    );
}

export default UserStats;
