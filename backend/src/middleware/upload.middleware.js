const fs = require('fs');
const path = require('path');
const multer = require('multer');

const env = require('../config/env');

const uploadDir = path.resolve(__dirname, '../../', env.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname || '').toLowerCase();
    const randomString = Math.random().toString(36).slice(2, 10);
    cb(null, `${Date.now()}-${randomString}${fileExtension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!env.allowedImageMime.includes(file.mimetype)) {
    const error = new Error(
      `Invalid file type. Allowed types: ${env.allowedImageMime.join(', ')}`
    );
    error.statusCode = 400;
    error.code = 'INVALID_UPLOAD_TYPE';
    return cb(error);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024,
  },
});

const singleScreenshotUpload = (req, res, next) => {
  upload.single('screenshot')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      const fileSizeError = new Error(`File too large. Max size is ${env.maxFileSizeMb} MB`);
      fileSizeError.statusCode = 400;
      fileSizeError.code = 'UPLOAD_TOO_LARGE';
      return next(fileSizeError);
    }

    if (!error.statusCode) {
      error.statusCode = 400;
    }

    return next(error);
  });
};

module.exports = {
  singleScreenshotUpload,
};
