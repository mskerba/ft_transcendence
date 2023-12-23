import axios from 'axios';
const BASE_URL = 'http://10.14.4.8:3000';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
