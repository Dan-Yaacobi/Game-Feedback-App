import apiClient from './apiClient';

export function getReports(params = {}) {
  return apiClient.get('/reports', {
    params,
  });
}

export function getReportById(id) {
  return apiClient.get(`/reports/${id}`);
}

export function updateReportStatus(id, status) {
  return apiClient.patch(`/reports/${id}/status`, { status });
}

export function createReport(formData) {
  return apiClient.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default {
  getReports,
  getReportById,
  updateReportStatus,
  createReport,
};
