import axios from '../api/axios';

const useRefreshToken = () => {

    const refresh = async () => {
        try {
            await axios.get('/auth/refresh');
            return true;
        } catch (error) {
            return false;
        }
    }

    return refresh;
}

export default useRefreshToken;
