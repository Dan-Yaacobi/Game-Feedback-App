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

const findReports = async ({ limit, offset, status, reportType }) => {
  const values = [];
  const where = [];

  if (status) {
    values.push(status);
    where.push(`status = $${values.length}`);
  }

  if (reportType) {
    values.push(reportType);
    where.push(`report_type = $${values.length}`);
  }

  values.push(limit);
  const limitIndex = values.length;
  values.push(offset);
  const offsetIndex = values.length;

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT *
    FROM reports
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const { rows } = await query(sql, values);
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
