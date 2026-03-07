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
};

module.exports = config;
