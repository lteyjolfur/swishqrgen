import axios from 'axios';

export async function get_png_from_api(url, data) {
  try {
    const response = await axios.post(url, data, {
      responseType: 'arraybuffer',
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to retrieve PNG from ${url}: ${error.message}`);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      try {
        console.error('Body:', error.response.data.toString());
      } catch {
        console.error('Body: <binary data>');
      }
    } else if (error.request) {
      console.error('No response received. Request:', error.request);
    } else {
      console.error('Error config:', error.config);
    }
    console.error('Request data:', data);
    return null;
  }
}
