import api from './api';

export const industryService = {
  async getIndustries() {
    const response = await api.get('/industries/');
    return response.data;
  },

  async getCategories(params?: any) {
    const response = await api.get('/industry-categories/', { params });
    return response.data;
  },

  async getTariffs(params?: any) {
    const response = await api.get('/tariff-rates/', { params });
    return response.data;
  },

  async getActiveTariffDocument() {
    const response = await api.get('/active-tariff-document/');
    return response.data;
  },

  async submitLicence(data: any) {
    const response = await api.post('/licence-applications/', data);
    return response.data;
  }
};