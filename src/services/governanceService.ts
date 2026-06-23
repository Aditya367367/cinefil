import api from './api';

export interface DocItem {
  id: number;
  title: string;
  document_type: string;
  file: string;
  thumbnail?: string;
  version?: string;
  published_date?: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const governanceService = {
  async getDocuments(): Promise<Paginated<DocItem>> {
    const response = await api.get<Paginated<DocItem>>('/governance-documents/');
    return response.data;
  },

  async getSchemes() {
    const response = await api.get('/schemes/');
    return response.data;
  },

  async getSchemeCategories() {
    const response = await api.get('/scheme-categories/');
    return response.data;
  }
};