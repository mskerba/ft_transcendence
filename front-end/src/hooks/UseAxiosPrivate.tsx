import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./UseRefreshToken";
import { useNavigate } from 'react-router-dom';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const navigate = useNavigate();

    useEffect(() => {
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    console.log(error?.response?.data);
                    if (error?.response?.data.message === 'verify 2FA!') {
                        navigate("/2FA");
                    } else {
                        prevRequest.sent = true;
                        const isRefreshed = await refresh();
                        if (isRefreshed)
                            return (axiosPrivate(prevRequest));
                        else navigate("/login");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [ refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;
