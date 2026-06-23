import api from './api';
import { Paginated } from './governanceService';

export interface Film {
  id: number;
  member_name: string;
  title: string;
  language: string;
  release_year: number;
  censor_certificate_no: string;
  cast?: Array<{ id: number; actor_name: string; character_name: string }>;
}

export const filmService = {
  async getPublicFilms(params?: { page?: number; page_size?: number; [key: string]: any }): Promise<Paginated<Film>> {
    const response = await api.get<Paginated<Film>>('/public-films/', { params: { page: 1, page_size: 10, ...params } });
    return response.data;
  },

  async getFilms(params?: any) {
    const response = await api.get('/films/', { params });
    return response.data;
  },

  async getFilmsPaginated(params?: { page?: number; page_size?: number; [key: string]: any }) {
    const response = await api.get('/films/', { params: { page: 1, page_size: 10, ...params } });
    return response.data;
  },

  async createFilm(data: any) {
    const response = await api.post('/create/film/', data);
    return response.data;
  },

  async getFilm(id: number) {
    const response = await api.get(`/films/${id}/`);
    return response.data;
  },

  async updateFilm(id: number, data: any) {
    const response = await api.put(`/films/${id}/`, data);
    return response.data;
  },

  async deleteFilm(id: number) {
    const response = await api.delete(`/films/${id}/`);
    return response.data;
  },

  async getFinancialYears() {
    const response = await api.get('/financial-years/');
    return response.data;
  },

  async getMyRoyalties() {
    const response = await api.get('/royalty-distributions/mine/');
    return response.data;
  }
};