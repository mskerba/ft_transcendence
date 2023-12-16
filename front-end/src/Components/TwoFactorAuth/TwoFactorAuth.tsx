
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/UseAxiosPrivate';
import './TwoFactorAuth.css';
import { Navigate } from 'react-router-dom';
import axios from '../../api/axios';

const TwoFactorVerification = () => {
    const [code, setCode] = useState<string>('');
    const { auth, login } = useAuth();

    const handleInputChange = (e: any) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/auth/verify-2fa', { token: code });
            console.log(res.data);
            if (res?.data == true) login();

        } catch (error) { console.log(error); }

    };

    return (
        (auth == 2 ? <Navigate to="/profile" />
            :
            <div className='twofa-container'>
                <h2>Two-Factor authentification</h2>
                <h3>Authentification code</h3>
                <input
                    type="text"
                    id="code-input"
                    value={code}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        ));
};

export default TwoFactorVerification;
