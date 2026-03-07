import apiClient from './apiClient';

export function createReport(formData) {
  return apiClient.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
