const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
require('./config/db');
const reportsRouter = require('./modules/reports/report.routes');
const { notFoundMiddleware } = require('./middleware/notFound.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use(
  pinoHttp({
    level: env.logLevel,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  `/${env.uploadDir}`,
  express.static(path.resolve(__dirname, '..', env.uploadDir))
);

app.use('/api', reportsRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
