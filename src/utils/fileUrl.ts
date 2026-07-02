import { API_ROOT } from '../services/api';

/**
 * Resolves a full backend media URL dynamically, supporting IP addresses
 * and different network configurations.
 * 
 * @param url The relative media file path or full URL.
 * @returns The resolved absolute backend file URL.
 */
export const getBackendFileUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  let backendRoot = '';
  try {
    backendRoot = new URL(API_ROOT).origin;
  } catch (e) {
    backendRoot = API_ROOT.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
  }
  return `${backendRoot}${url.startsWith('/') ? '' : '/'}${url}`;
};
