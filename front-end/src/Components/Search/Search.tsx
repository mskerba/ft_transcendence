import { useEffect, useState } from 'react';
import './Search.css'


const Search = () => {
    const [user, setUsers] = useState([]);
    const [groups, setGroupss] = useState([]);
    const [option, setOption] = useState(0);

    useEffect

    return (
      <div className="search-page">
        <div className='people-group'>
          <p>People (20)</p>
          <p>Groups (4)</p>
        </div>
        <div className='search-list'></div>
      </div>
    );
  };
  
  export default Search;
  