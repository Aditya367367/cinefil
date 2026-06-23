import api from './api';

export const companyService = {
  async createCompany(data: any) {
    const response = await api.post('/companies/', data);
    return response.data;
  },
};