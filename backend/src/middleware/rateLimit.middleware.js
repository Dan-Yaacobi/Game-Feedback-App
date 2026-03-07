const rateLimit = require('express-rate-limit');
const {
  DEFAULT_RATE_LIMIT_WINDOW,
  DEFAULT_RATE_LIMIT_MAX,
} = require('../shared/constants');

const reportSubmitLimiter = rateLimit({
  windowMs: DEFAULT_RATE_LIMIT_WINDOW,
  max: DEFAULT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many report submissions from this IP. Please try again later.',
  },
});

module.exports = {
  reportSubmitLimiter,
};
