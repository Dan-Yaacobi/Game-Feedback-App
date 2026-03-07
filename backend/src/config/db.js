const { Pool } = require('pg');

const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error:', error);
});

const query = (text, params = []) => {
  return pool.query(text, params).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('PostgreSQL query failed:', error);
    throw error;
  });
};

const checkDatabaseConnection = async () => {
  try {
    await query('SELECT 1');
    // eslint-disable-next-line no-console
    console.log('PostgreSQL connection check passed.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to PostgreSQL during startup check.', error);
    process.exit(1);
  }
};

checkDatabaseConnection();

module.exports = {
  pool,
  query,
};
