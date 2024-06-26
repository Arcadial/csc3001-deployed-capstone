import axios from 'axios';
import { HOSTNAME } from '../constants/endpointConstants';
import { Certificate } from '../types/Certificate';
import { getCookie } from 'cookies-next';

async function getCerts(): Promise<Array<Certificate>> {
  try {
    const response = await axios.get(`${HOSTNAME}/api/certs/`, {
      headers: {
        'X-API-Key': getCookie('apiKey'), // Including the API key in the headers
      },
    });

    if (response.status !== 200) {
      throw new Error('Error retrieving certificates');
    }

    return response.data;
  } catch (error) {
    throw new Error('Error retrieving certificates');
  }
}

export default getCerts;
