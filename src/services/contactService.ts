import api from './api';

export const contactService = {
  async submitContact(data: any) {
    const response = await api.post('/contact/', data);
    return response.data;
  }
};
