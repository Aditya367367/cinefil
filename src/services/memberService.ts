import api from './api';

export const memberService = {
  async getMembers(params?: any) {
    const response = await api.get('/members/', { params });
    return response.data;
  },

  async getMember(id: number) {
    const response = await api.get(`/members/${id}/`);
    return response.data;
  },

  async getMemberBySlug(slug: string) {
    const response = await api.get(`/members/slug/${slug}/`);
    return response.data;
  },

  async getPublicMember(id: number) {
    const response = await api.get(`/public-members/${id}/`);
    return response.data;
  },

  async getTeams() {
    const response = await api.get('/teams/');
    return response.data;
  },

  async getMembershipTypes() {
    const response = await api.get('/membership-types/');
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get('/membership-applications/');
    return response.data;
  },

  async submitApplication(data: any) {
    const response = await api.post('/membership-applications/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async approveSimulatedApplication() {
    const response = await api.post('/membership-applications/approve-simulated/');
    return response.data;
  }
};