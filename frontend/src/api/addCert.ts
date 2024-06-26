import axios from 'axios';
import { HOSTNAME } from '../constants/endpointConstants';
import { getCookie } from 'cookies-next';

async function addCert(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(
      `${HOSTNAME}/api/certs/process-new-cert`,
      formData,
      {
        headers: {
          'X-API-Key': getCookie('apiKey'), // Including the API key in the headers
        },
        responseType: 'blob', // Set the response type to 'blob' to receive binary data as a Blob
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create an anchor element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cert_stamp.jpg'); // Set a default filename

    // Append the anchor element to the document body
    document.body.appendChild(link);

    // Trigger a click event on the anchor element
    link.click();

    // Clean up by removing the anchor element
    document.body.removeChild(link);

    // Clean up by revoking the object URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('Error processing certificate');
  }
}

export default addCert;
