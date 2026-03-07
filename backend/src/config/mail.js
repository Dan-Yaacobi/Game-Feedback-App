const nodemailer = require('nodemailer');

const env = require('./env');
const logger = require('../shared/logger');

const smtpConfig = {
  host: env.smtpHost,
  port: env.smtpPort,
  auth:
    env.smtpUser && env.smtpPass
      ? {
          user: env.smtpUser,
          pass: env.smtpPass,
        }
      : undefined,
};

const isSmtpConfigured =
  Boolean(env.smtpHost) &&
  Boolean(env.smtpPort) &&
  Boolean(env.smtpUser) &&
  Boolean(env.smtpPass);

const transporter = isSmtpConfigured ? nodemailer.createTransport(smtpConfig) : null;

if (!isSmtpConfigured && env.nodeEnv !== 'production') {
  logger.warn('SMTP is not configured. Email notifications are disabled in this environment.');
}

module.exports = {
  transporter,
  isSmtpConfigured,
};
