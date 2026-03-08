const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
require('./config/db');
const reportsRouter = require('./modules/reports/report.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const logger = require('./shared/logger');
const { notFoundMiddleware } = require('./middleware/notFound.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

app.use(logger.httpLogger);
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  `/${env.uploadDir}`,
  express.static(path.resolve(__dirname, '..', env.uploadDir))
);

app.use('/api', reportsRouter);
app.use('/api/admin', adminRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
