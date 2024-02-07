import './UserAvatar.css'

const UserAvatar = ({ avatar }: any) => {
    return (
        <img src={`http://10.14.5.10:3000/avatar/${avatar}`} className='user-avatar'/>
    );
}

export default UserAvatar;
