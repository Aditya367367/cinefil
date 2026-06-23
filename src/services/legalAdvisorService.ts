import api from './api';

export interface LegalAdvisor {
  id: string;
  member: number;
  member_name: string;
  specialisation: string;
  photo_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  slug?: string;
}

export const legalAdvisorService = {
  getAdvisors: async (): Promise<LegalAdvisor[]> => {
    const response = await api.get('/legal-advisors/');
    return response.data.results;
  },
};