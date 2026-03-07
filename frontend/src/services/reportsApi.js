import apiClient from './apiClient';

export function getReports(params = {}) {
  return apiClient.get('/reports', {
    params,
  });
}

export default {
  getReports,
};
export function createReport(formData) {
  return apiClient.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
