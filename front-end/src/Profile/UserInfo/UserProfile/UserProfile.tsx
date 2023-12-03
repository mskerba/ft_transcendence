import './UserProfile.css'

const UserProfile = () => {
    return (
        <div className='user-profile-container'>
            <h3 className='name'>momeaizi</h3>
            <div className='level-container'>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M24 42L4 18.5L9.69488 6L38.3051 6L44 18.5L24 42Z" fill="#FFD700" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M32 18L24 27L16 18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h4 className='level-value'>11.75</h4>
            </div>
        </div>
    );
}
export default UserProfile;
