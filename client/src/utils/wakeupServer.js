import axios from 'axios';

export const wakeupServer = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/wake-up`);
    console.log('Backend server is awake');
    return response.data;
  } catch (error) {
    console.log('Failed to wake up server');
    throw error;
  }
};