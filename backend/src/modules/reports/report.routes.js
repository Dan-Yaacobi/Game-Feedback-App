const { Router } = require('express');
const reportController = require('./report.controller');

const router = Router();

router.post('/reports', reportController.createReport);
router.get('/reports', reportController.listReports);
router.get('/reports/:id', reportController.getReportById);
router.patch('/reports/:id/status', reportController.updateStatus);

module.exports = router;
