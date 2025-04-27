import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

// Axios request

export const get_login = async () => {
    try {
        const res = await axios.get(`${API_URL}/auth/login`);
        return res.data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


