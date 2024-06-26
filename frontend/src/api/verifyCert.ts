import axios from 'axios';
import { HOSTNAME } from '../constants/endpointConstants';

async function verifyCert(file: File): Promise<boolean> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(
      `${HOSTNAME}/api/certs/verify-cert`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error('Error validating certificate:', error);
    throw new Error('Error validating certificate');
  }
}

export default verifyCert;
