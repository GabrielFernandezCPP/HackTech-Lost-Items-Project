import axios from 'axios'

// Axios request

export const get_ = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/`);
    if (res.status != 200)
    {
        console.error(res.statusText);
    }

    return {success: res.status == 200};
}