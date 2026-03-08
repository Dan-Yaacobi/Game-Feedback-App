import { useMemo } from 'react';

const STORAGE_KEY = 'admin_authenticated';

export default function useAdminAuth() {
  const isAuthenticated = useMemo(() => localStorage.getItem(STORAGE_KEY) === 'true', []);

  const setAuthenticated = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const clearAuthentication = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    isAuthenticated,
    setAuthenticated,
    clearAuthentication,
  };
}

export { STORAGE_KEY };
