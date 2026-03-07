const path = require('path');

const env = require('../../config/env');
const reportRepository = require('./report.repository');

class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
  }
}

const ALLOWED_TRANSITIONS = {
  open: ['investigating'],
  investigating: ['closed'],
  closed: [],
};

const createReport = async (data) => {
  const screenshotPath = data.screenshot
    ? path.posix.join(env.uploadDir, path.basename(data.screenshot.path))
    : null;

  return reportRepository.insertReport({
    title: data.title,
    description: data.description,
    reportType: data.reportType,
    playerEmail: data.playerEmail,
    playerName: data.playerName,
    screenshotPath,
    screenshotMimeType: data.screenshot?.mimeType || null,
    screenshotSizeBytes: data.screenshot?.sizeBytes || null,
  });
};

const listReports = async (filters = {}) => {
  const limit = Number(filters.limit) || 20;
  const offset = Number(filters.offset) || 0;

  return reportRepository.findReports({
    limit,
    offset,
    status: filters.status,
    reportType: filters.reportType,
  });
};

const getReportById = async (id) => {
  const report = await reportRepository.findReportById(id);

  if (!report) {
    throw new ServiceError('Report not found', 404);
  }

  return report;
};

const updateStatus = async (id, status) => {
  const report = await getReportById(id);

  const allowed = ALLOWED_TRANSITIONS[report.status] || [];
  if (!allowed.includes(status)) {
    throw new ServiceError(
      `Invalid status transition from ${report.status} to ${status}`,
      400
    );
  }

  return reportRepository.updateReportStatus(id, status);
};

module.exports = {
  ServiceError,
  createReport,
  listReports,
  getReportById,
  updateStatus,
};
