import api from './api';

export interface SiteStats {
  member_count: number;
  film_count: number;
}

const statsService = {
  getStats: async (): Promise<SiteStats> => {
    const response = await api.get<SiteStats>('/stats/');
    return response.data;
  },
};

export default statsService;