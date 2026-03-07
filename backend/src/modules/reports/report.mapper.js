const toScreenshotUrl = (screenshotPath) => {
  if (!screenshotPath) {
    return null;
  }

  const normalizedPath = screenshotPath.replace(/\\/g, '/');
  const uploadsIndex = normalizedPath.lastIndexOf('/uploads/');

  if (uploadsIndex >= 0) {
    return normalizedPath.slice(uploadsIndex);
  }

  if (normalizedPath.startsWith('uploads/')) {
    return `/${normalizedPath}`;
  }

  const fileName = normalizedPath.split('/').pop();
  return fileName ? `/uploads/${fileName}` : null;
};

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
    screenshotUrl: toScreenshotUrl(row.screenshot_path),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

module.exports = {
  mapReportRow,
};
