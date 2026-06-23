import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useUserProfile = () => {
  const token = localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await authService.getProfile();
      if (response.success && response.profile) {
        return response.profile;
      }
      throw new Error('Failed to fetch profile');
    },
    enabled: !!token, // Only fetch if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserMembership = () => {
  const { data: user, isLoading } = useUserProfile();
  
  return {
    isMember: user?.membership_status === 'approved' || user?.role === 'member',
    isPendingMember: user?.membership_status === 'pending',
    isLoading,
    user,
  };
};
