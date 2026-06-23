import api from './api';

export const actorService = {
  async createActor(data: any) {
    const response = await api.post('/create/actor/', data);
    return response.data;
  },
};