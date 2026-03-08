const { query } = require('../../config/db');

const getAdminSettings = async () => {
  const sql = `
    SELECT id, password_hash
    FROM admin_settings
    ORDER BY created_at ASC
    LIMIT 1
  `;

  const { rows } = await query(sql);
  return rows[0] || null;
};

const updatePassword = async (hash) => {
  const sql = `
    UPDATE admin_settings
    SET password_hash = $1, updated_at = NOW()
    WHERE id = (
      SELECT id
      FROM admin_settings
      ORDER BY created_at ASC
      LIMIT 1
    )
    RETURNING id
  `;

  const { rows } = await query(sql, [hash]);
  return rows[0] || null;
};

module.exports = {
  getAdminSettings,
  updatePassword,
};
