import axios from 'axios';
import { BASE_URL } from '../constance';
import { store } from '../store/store';

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.auth.token.accessToekn;

    config.params = config.params || {};
    config.params['Authorization'] = `Bearer ${token}`
	console.log(config);
    return config;
});

export default axiosInstance;
