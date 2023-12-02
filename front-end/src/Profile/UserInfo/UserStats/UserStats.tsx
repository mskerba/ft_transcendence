import './UserStats.css'

const UserStats = () => {
    return (
        <div className='user-stats-container'>
            <div className='user-stats'>
                <span className='user-stats-label'>Games</span>
                <span className='user-stats-value'>145</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Wins</span>
                <span className='user-stats-value'>127</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Losses</span>
                <span className='user-stats-value'>18</span>
            </div>
            <div className='user-stats'>
                <span className='user-stats-label'>Friends</span>
                <span className='user-stats-value'>96</span>
            </div>
        </div>
    );
}

export default UserStats;
