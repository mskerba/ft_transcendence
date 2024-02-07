import { useEffect, useState } from 'react';
import './FriendRequests.css'
import useAxiosPrivate from '../../../../hooks/UseAxiosPrivate';
import { Link } from 'react-router-dom';

const FriendRequest = () => {
  const [friendReqs, setFriendReqs] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchFriendReqs();
  }, []);
  
  const fetchFriendReqs = async () => {
    const res = await axiosPrivate.get(`/friend-requests`);
    setFriendReqs(res.data.receivedFriendRequests);
  }

  const accpetFriendReq = async (requestId: string) => {
    try {
      await axiosPrivate.get(`accept-friend-request/${requestId}`);
      await fetchFriendReqs();
    } catch( error ) {}
  }

  const declineFriendReq = async (requestId: string) => {
    try {
      await axiosPrivate.get(`decline-friend-request/${requestId}`);
      await fetchFriendReqs();
    } catch( error ) {}
  }

  return (
    <div>
      {friendReqs.length > 0 && friendReqs.map((friendRequest) => (
        <div key={friendRequest.requestId} className='friend-request'>
          <Link to={`/user/${friendRequest.sender.userId}`} className='user-avatar-name'>
            <img src={`http://10.14.4.8:3000/avatar/${friendRequest.sender.avatar}`} className='avatar' alt={`Avatar for ${friendRequest.sender.name}`} />
            <h4>{friendRequest.sender.name}</h4>
          </Link>
          <div className='friend-request-buttons'>
            <div onClick={async () => accpetFriendReq(friendRequest.requestId)} className='friend-request-confirm-button'><img src='/src/assets/accept-request-hovered.svg' /></div>
            <div onClick={async () => declineFriendReq(friendRequest.requestId)} className='friend-request-delete-button'><img src='/src/assets/decline-request.svg' /></div>
          </div>
        </div>
      ))}
    </div>

  );
}

export default FriendRequest;
