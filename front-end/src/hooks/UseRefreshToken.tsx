import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const useRefreshToken = () => {
    const { login } = useAuth();

    const refresh = async () => {
        console.log("REFRESH TOKEN HERE!!!!!!!!!!");
        const response = await axios.get('/auth/refresh', {
            withCredentials: true,
        });

        console.log(response);

        if (response.status == 200) {
            login();
            return true;
        }

        return false;

    }

    return refresh;
}

export default useRefreshToken;
