import './Achievements.css';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import { useAuth } from '../../../../context/AuthContext';


const Achievement = ({ userId }: any) => {
    const [achievements, setbAchievements] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const fetchAchievements = async () => {
        const res = await axiosPrivate.get(`/achievement/${userId}`);
        setbAchievements(res.data);
    }

    useEffect(() => {
        fetchAchievements();
    }, []);

    return (
        <div>
            {achievements.length > 0 && achievements.map((achievement) => (
                <div className='achievement' key={achievement.achievementId}>
                    <h3 className='achievement-title'>{achievement.name}</h3>
                    <p className='achievement-description'>{achievement.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Achievement;
