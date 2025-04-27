import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;
const DEV_MODE = import.meta.env.VITE_SET_DEV;

axios.defaults.withCredentials = true;

// Axios request

export const get_login = async (email, password) => {
    try {
        const res = await axios.post(
            `${API_URL}/auth/login`, 
            {
                email: email, 
                password: password
            });
        return res.data.email;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export const get_logout = async () => {
    try {
        const res = await axios.get(`${API_URL}/auth/logout`);
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export const register_user = async (email, password) => {
    try {
        const res = await axios.post(
            `${API_URL}/auth/register`, 
            {
                email: email, 
                password: password
            }
        );
        return res.data.email;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export const check_auth = async () => {
    try {
        const res = await axios.get(`${API_URL}/auth/check`);
        return res.data.email;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

export const get_items = async () => {
    try {
        const res = await axios.post(`${API_URL}/items/get`);
        return res.data.items;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}