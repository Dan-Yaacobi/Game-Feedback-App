require('dotenv').config();

const app = require('./app');

const port = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend API listening on port ${port}`);
  });
}
