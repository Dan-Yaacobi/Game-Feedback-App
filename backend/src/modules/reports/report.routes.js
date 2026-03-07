const { Router } = require('express');
const reportController = require('./report.controller');
const { validate } = require('../../middleware/validate.middleware');
const {
  createReportSchema,
  updateStatusSchema,
  listReportsQuerySchema,
} = require('./report.validation');
const { singleScreenshotUpload } = require('../../middleware/upload.middleware');
const { reportSubmitLimiter } = require('../../middleware/rateLimit.middleware');

const router = Router();

router.post(
  '/reports',
  reportSubmitLimiter,
  singleScreenshotUpload,
  validate(createReportSchema),
  reportController.createReport
);
router.get('/reports', validate(listReportsQuerySchema), reportController.listReports);
router.get('/reports/:id', reportController.getReportById);
router.patch('/reports/:id/status', validate(updateStatusSchema), reportController.updateStatus);

module.exports = router;
