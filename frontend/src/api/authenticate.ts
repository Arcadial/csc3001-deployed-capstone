import axios from 'axios';
import { HOSTNAME } from '../constants/endpointConstants';
import { setCookie } from 'cookies-next';

type User = {
  username: string;
  password: string;
};

async function authenticate(user: User) {
  try {
    const response = await axios.post(`${HOSTNAME}/api/auth/login`, user);

    if (response.status === 200) {
      setCookie('apiKey', response.data.apiKey);
    }
    return response;
  } catch (error) {
    console.error('Failed to login:', error);
    throw new Error('Failed to login. Invalid credentials');
  }
}

export default authenticate;
