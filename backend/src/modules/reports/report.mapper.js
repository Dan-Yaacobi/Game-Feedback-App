const mapReportRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    reportType: row.report_type,
    status: row.status,
    playerEmail: row.player_email,
    playerName: row.player_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

module.exports = {
  mapReportRow,
};
