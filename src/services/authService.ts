import api from './api';

export const authService = {
  async login(data: any) {
    const response = await api.post('/auth/login/', data);
    if (response.data.success) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async signup(data: any) {
    const response = await api.post('/auth/signup/', data);
    if (response.data.success) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout/', { refresh });
    } catch (e) {
      // Ignore token blacklist error on logout
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  },

  async getProfile() {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(data: FormData) {
    const response = await api.put('/auth/profile/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async changePassword(data: any) {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },

  async forgotPassword(data: { email: string }) {
    const response = await api.post('/auth/forgot-password/', data);
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post('/auth/reset-password/', data);
    return response.data;
  }
};