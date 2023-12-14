import axios from '../api/axios';

const useRefreshToken = () => {

    const refresh = async () => {
        console.log("REFRESH TOKEN HERE!!!!!!!!!!");
        const response = await axios.get('/auth/refresh');

        console.log(response);

        if (response.status === 200) {
            return true;
        }

        return false;

    }

    return refresh;
}

export default useRefreshToken;
