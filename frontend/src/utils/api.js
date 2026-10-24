import { safeStorage } from './storage';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

export async function apiCall(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const lang = safeStorage.getItem('sakhi_lang') || navigator.language?.startsWith('hi') ? 'hi' : 'en';
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': lang,
    ...options.headers,
  };
  
  const response = await fetch(baseUrl + endpoint, {
    ...options,
    headers,
    body: options.body ? JSON.stringify({...JSON.parse(options.body), lang}) : options.body,
  });
  return response;
}
