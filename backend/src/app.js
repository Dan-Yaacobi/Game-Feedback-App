const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(
  pinoHttp({
    level: process.env.LOG_LEVEL || 'info',
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

module.exports = app;
