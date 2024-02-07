import { useEffect, useState } from 'react';
import './Games.css'
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';

const Game = ({userId}: any) => {
    const [games, setGames] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { authUser }: any = useAuth();

    useEffect(() => {
        const fetchgames = async () => {
            const res = await axiosPrivate.get(`/game/${userId}`);
            setGames(res.data);
            console.log(res.data);
        }
        fetchgames();
    }, [userId]);

    return (
        <div>
            {games.length > 0 && games.map((game) => (
                <div className='game' key={game.gameId}>
                    <div className='game-palyers'>
                        <Link to={`/user/${game.winnerId}`} className='player custom-link' >
                            <img className='palyer-avatar' src={`http://10.14.4.8:3000/avatar/${game.winner.avatar}`} />
                            <p className='player-name'>{game.winner.name}</p>
                            <p>{ game.winnerScore }</p>
                        </Link>
                        <Link to={`/user/${game.loserId}`} className='player custom-link'>
                        <img className='palyer-avatar' src={`http://10.14.4.8:3000/avatar/${game.loser.avatar}`} />
                            <p className='player-name'>{ game.loser.name }</p>
                            <p>{ game.loserScore }</p>
                        </Link>
                    </div>
                    <div className='border'></div>
                    <div className='game-result'>
                        {
                            (userId == game.winnerId)
                             ? <div className='result w'>W</div>
                             : <div className='result l'>L</div>
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Game;
