import axios from '../utils/api';

export const loginUser = async (email, password) => {
    const res = await axios.post('/login', { email, password });
    return res.data;
};
