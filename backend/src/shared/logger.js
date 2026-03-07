const pino = require('pino');
const pinoHttp = require('pino-http');
const env = require('../config/env');

const logger = pino({
  level: env.logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  ...(env.nodeEnv === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
});

const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      path: req.url,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
  customProps: (_req, res) => ({
    responseTime: res.responseTime,
  }),
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, error) =>
    `${req.method} ${req.url} ${res.statusCode} - ${error.message}`,
});

module.exports = logger;
module.exports.httpLogger = httpLogger;
