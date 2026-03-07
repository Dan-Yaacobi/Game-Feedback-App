const reportService = require('./report.service');

const createReport = async (req, res, next) => {
  try {
    const { title, description, reportType, playerEmail, playerName } = req.body;

    if (!title || !description || !reportType || !playerEmail || !playerName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

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
    const reports = await reportService.listReports(req.query);

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
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: status',
      });
    }

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
