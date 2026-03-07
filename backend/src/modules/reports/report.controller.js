const reportService = require('./report.service');

const createReport = async (req, res, next) => {
  try {
    const { title, description, report_type: reportType, player_email: playerEmail, player_name: playerName } =
      req.body;

    const report = await reportService.createReport({
      title,
      description,
      reportType,
      playerEmail,
      playerName,
    });

    return res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    return next(error);
  }
};

const listReports = async (req, res, next) => {
  try {
    const { page, limit, status, report_type: reportType } = req.query;
    const offset = (page - 1) * limit;
    const reports = await reportService.listReports({ limit, offset, status, reportType });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await reportService.updateStatus(req.params.id, status);

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createReport,
  listReports,
  getReportById,
  updateStatus,
};
