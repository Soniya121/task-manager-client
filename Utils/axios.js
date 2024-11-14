import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const axios = Axios.create({
    baseURL: "http://192.168.105.97:3000/api/"
});

axios.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

export default axios;