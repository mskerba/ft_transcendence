import './UserProfile.css'

const UserProfile = ({ username }: any) => {
    return (
        <div className='user-profile-container'>
            <h2 className='name'>{username}</h2>
            <div className='level-container'>
                <img src='/src/assets/level.svg' />
                <h3 className='level-value'>11.75</h3>
            </div>
        </div>
    );
}
export default UserProfile;
