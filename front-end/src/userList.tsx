// UserList.js
import { useState, useEffect } from 'react';
import useAxiosPrivate from './hooks/UseAxiosPrivate';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPrivate.get('http://localhost:3000/user');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // The empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <h2>User List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.userId}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
