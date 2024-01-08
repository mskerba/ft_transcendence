import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LeaderBoard.css';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';

const LeaderBoard = () => {
    const [sortedUsers, setSortedUsers] = useState([]);
    const [lastFiveGames, setLastFiveGames] = useState([]);
    const [index, setIndex] = useState(0);
    const axiosPrivate = useAxiosPrivate();
    const { authUser }: any = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosPrivate.get('/leaderboard');
                setSortedUsers(res.data);
                console.log(res.data);
                if (res.data.length > 0) {
                    const res_ = await axiosPrivate(`/game/last-5/${sortedUsers[0].userId}`);
                    setLastFiveGames(res_.data);
                }
            } catch(error) {}
        }
        fetchLeaderboard();
    }, []);
    
    const handleClick = async (_index: number) => {
        setLastFiveGames([]);
        try {
            const res = await axiosPrivate(`/game/last-5/${sortedUsers[_index].userId}`);
            setLastFiveGames(res.data);
            console.log(res.data);
        } catch (error) {}
        setIndex(_index);
    }


    return (
        <div className='leaderboard-page'>
            <div className='leaderboard-container'>
                {sortedUsers.length > 0 && sortedUsers.map((user, _index) => (
                    <div className={`leaderboard-item ${index == _index ? 'active-user' : ''}`} key={user.userId}
                        onClick={() => (handleClick(_index))}
                    >
                        <p className='leaderboard-rank'>{_index + 1}</p>
                        <div className='leaderboard-username-avatar'>
                            <img className='leaderboard-avatar' src={`http://localhost:3000/avatar/${user.avatar}`} />
                            <p className='leaderboard-username'>{user.name}</p>
                        </div>
                        <p className='leaderboard-level'>{user.level.toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className='leaderboard-userinfo'>
                {sortedUsers.length > 0 &&
                    <>
                        <img className='leaderboard-userinfo-avatar' src={`http://localhost:3000/avatar/${sortedUsers[index].avatar}`} />
                        <h2>{sortedUsers[index].name}</h2>


                        <div className='user-stats-container'>
                            <div className='user-stats'>
                                <span className='user-stats-label'>Games</span>
                                <span className='user-stats-value'>{sortedUsers[index].games}</span>
                            </div>
                            <div className='user-stats'>
                                <span className='user-stats-label'>Wins</span>
                                <span className='user-stats-value'>{sortedUsers[index].wins}</span>
                            </div>
                            <div className='user-stats'>
                                <span className='user-stats-label'>Losses</span>
                                <span className='user-stats-value'>{sortedUsers[index].losses}</span>
                            </div>
                        </div>
                        <div className='last-five-games'>
                            { lastFiveGames.length > 0 && lastFiveGames.map((game) => (
                                sortedUsers[index].userId === game.winnerId
                                 ? <div className='w'>W</div>
                                 : <div className='l'>L</div>
                            ))
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default LeaderBoard;
