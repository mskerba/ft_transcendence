import './UserAvatar.css'

const UserAvatar = ({ avatar }: any) => {
    return (
        <img src={`http://localhost:3000/avatar/${avatar}`} className='user-avatar'/>
    );
}

export default UserAvatar;
