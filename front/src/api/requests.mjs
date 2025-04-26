import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

// Axios request

export const get_login = async () => {
    const res = await axios.get(`${API_URL}/auth/login`);

    if (res.status != 200)
    {
        return null;
        console.error(res.statusText);
    }

    return res.data;
}


