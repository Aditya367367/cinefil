import api from './api';

export interface Announcement {
  id: number;
  title: string;
  date: string;
  file: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedAnnouncements {
  count: number;
  next: string | null;
  previous: string | null;
  results: Announcement[];
}

const announcementService = {
  getAnnouncements: async (): Promise<PaginatedAnnouncements> => {
    const response = await api.get<PaginatedAnnouncements>('/announcements/');
    return response.data;
  },
};

export default announcementService;