const env = require('../config/env');
const { transporter, isSmtpConfigured } = require('../config/mail');
const logger = require('../shared/logger');

const getDescriptionPreview = (description) => {
  if (!description) {
    return 'No description provided.';
  }

  const trimmed = description.trim();
  if (trimmed.length <= 500) {
    return trimmed;
  }

  return `${trimmed.slice(0, 500)}...`;
};

const formatPlayerInfo = (report) => {
  if (report.playerName && report.playerEmail) {
    return `${report.playerName} (${report.playerEmail})`;
  }

  if (report.playerName) {
    return report.playerName;
  }

  if (report.playerEmail) {
    return report.playerEmail;
  }

  return 'Anonymous';
};

const sendReportNotification = async (report) => {
  if (!isSmtpConfigured || !transporter || !env.ownerEmail) {
    logger.debug({ reportId: report?.id }, 'Skipping report notification email because SMTP is not configured.');
    return;
  }

  const submittedAt = report.createdAt
    ? new Date(report.createdAt).toISOString()
    : new Date().toISOString();

  const body = `A new report has been submitted.\n\nTitle: ${report.title}\nType: ${report.reportType}\nPlayer: ${formatPlayerInfo(report)}\n\nDescription:\n${getDescriptionPreview(report.description)}\n\nReport ID: ${report.id}\nSubmitted at: ${submittedAt}`;

  await transporter.sendMail({
    from: env.smtpUser,
    to: env.ownerEmail,
    subject: `New Game Report Submitted: ${report.title}`,
    text: body,
  });
};

module.exports = {
  sendReportNotification,
};
