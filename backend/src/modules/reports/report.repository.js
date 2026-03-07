const { query } = require('../../config/db');
const { mapReportRow } = require('./report.mapper');

const insertReport = async (reportData) => {
  const { title, description, reportType, playerEmail, playerName } = reportData;

  const sql = `
    INSERT INTO reports (title, description, report_type, player_email, player_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const { rows } = await query(sql, [title, description, reportType, playerEmail, playerName]);
  return mapReportRow(rows[0]);
};

const findReports = async ({ limit, offset }) => {
  const sql = `
    SELECT *
    FROM reports
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await query(sql, [limit, offset]);
  return rows.map(mapReportRow);
};

const findReportById = async (id) => {
  const sql = 'SELECT * FROM reports WHERE id = $1';
  const { rows } = await query(sql, [id]);
  return mapReportRow(rows[0]);
};

const updateReportStatus = async (id, status) => {
  const sql = `
    UPDATE reports
    SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const { rows } = await query(sql, [id, status]);
  return mapReportRow(rows[0]);
};

module.exports = {
  insertReport,
  findReports,
  findReportById,
  updateReportStatus,
};
