import apiClient from './apiClient';

export function getReports(params = {}) {
  return apiClient.get('/reports', {
    params,
  });
}

export default {
  getReports,
};
