const dotenv = require('dotenv');

dotenv.config();

const requiredVariables = ['DATABASE_URL', 'PORT', 'NODE_ENV'];
const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.includes('DATABASE_URL')) {
  throw new Error(
    'Missing required environment variable: DATABASE_URL. Please set it in backend/.env.'
  );
}

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missingVariables.join(', ')}`
  );
}

const isProduction = process.env.NODE_ENV === 'production';
const smtpRequiredVariables = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'OWNER_EMAIL',
];

if (isProduction) {
  const missingSmtpVariables = smtpRequiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingSmtpVariables.length > 0) {
    throw new Error(
      `Missing required SMTP environment variable(s) in production: ${missingSmtpVariables.join(', ')}`
    );
  }
}

const config = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  allowedImageMime: (process.env.ALLOWED_IMAGE_MIME || 'image/png,image/jpeg,image/webp')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  ownerEmail: process.env.OWNER_EMAIL,
};

module.exports = config;
