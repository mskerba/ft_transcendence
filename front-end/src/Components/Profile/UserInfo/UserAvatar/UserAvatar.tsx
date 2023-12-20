import './UserAvatar.css'

const UserAvatar = ({ avatar }: any) => {
    return (
        <img src={avatar} className='user-avatar' />
    );
}

export default UserAvatar;
