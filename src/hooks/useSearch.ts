import api from '../services/api';

interface SelectOption {
  value: string;
  label: string;
}

// Generic function to search for options
export const searchApi = async (endpoint: string, inputValue: string, searchField: string): Promise<SelectOption[]> => {
  if (!inputValue) {
    return [];
  }
  try {
    const response = await api.get(endpoint, { params: { [searchField]: inputValue } });
    // Ensure response.data.results is an array before mapping
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results.map((item: any) => ({
        value: item.id.toString(),
        label: item.name || item.title || item.company_name || item.full_name,
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error searching ${endpoint}:`, error);
    return [];
  }
};

// Generic function to create a new option
export const createApi = async (endpoint: string, data: { [key: string]: string }): Promise<SelectOption> => {
  try {
    const response = await api.post(endpoint, data);
    return {
      value: response.data.id.toString(),
      label: response.data.name || response.data.title,
    };
  } catch (error) {
    console.error(`Error creating at ${endpoint}:`, error);
    throw error;
  }
};

import { actorService } from '../services/actorService';
import { filmService } from '../services/filmService';
import { companyService } from '../services/companyService';

// Hook for company search and creation
export const useCompanySearch = () => ({
  loadOptions: (inputValue: string) => searchApi('/search/companies/', inputValue, 'company_name'),
  onCreateOption: async (inputValue: string) => {
    const newCompany = await companyService.createCompany({ name: inputValue, banner_name: inputValue });
    return {
      value: newCompany.id.toString(),
      label: newCompany.name,
    };
  },
});

// Hook for right-holder member search
export const useRightHolderMemberSearch = () => ({
  loadOptions: async (inputValue: string): Promise<SelectOption[]> => {
    if (!inputValue) {
      return [];
    }

    try {
      const response = await api.get('/search/companies/', { params: { company_name: inputValue } });
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results
          .filter((item: any) => item.member)
          .map((item: any) => ({
            value: item.member.toString(),
            label: item.company_name || item.company?.name || item.member_name || item.member?.full_name,
          }));
      }
      return [];
    } catch (error) {
      console.error('Error searching right-holder members:', error);
      return [];
    }
  },
  onCreateOption: async (inputValue: string) => {
    const newCompany = await companyService.createCompany({ name: inputValue, banner_name: inputValue });
    return {
      value: newCompany.id.toString(),
      label: newCompany.name,
    };
  },
});

// Hook for film search and creation
export const useFilmSearch = () => ({
  loadOptions: (inputValue: string) => searchApi('/search/films/', inputValue, 'title'),
  onCreateOption: async (inputValue: string) => {
    const newFilm = await filmService.createFilm({ title: inputValue });
    return {
      value: newFilm.id.toString(),
      label: newFilm.title,
    };
  },
});

// Hook for actor search and creation
export const useActorSearch = () => ({
  loadOptions: (inputValue: string) => searchApi('/search/actors/', inputValue, 'name'),
  onCreateOption: async (inputValue: string) => {
    const newActor = await actorService.createActor({ name: inputValue });
    return {
      value: newActor.id.toString(),
      label: newActor.name,
    };
  },
});
