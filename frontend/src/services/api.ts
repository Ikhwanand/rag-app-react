import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const chatAPI = {
  sendMessage: async (query: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { query });
      console.log('API Response:', response.data); // For debugging
      return {
        data: {
          message: response.data.response,
          sources: response.data.sources || []
        }
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};