const logger = require('../shared/logger');

const errorMiddleware = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const code = error.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');

  logger.error(
    {
      err: error,
      path: req.path,
      method: req.method,
      statusCode,
    },
    'Request failed'
  );

  const payload = {
    success: false,
    error: {
      message,
      code,
    },
  };

  if (error.details) {
    payload.error.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.error.stack = error.stack;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  errorMiddleware,
};
