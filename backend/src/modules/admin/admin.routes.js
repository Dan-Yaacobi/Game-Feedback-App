const { Router } = require('express');

const adminController = require('./admin.controller');
const { validate } = require('../../middleware/validate.middleware');
const { loginSchema, changePasswordSchema } = require('./admin.validation');

const router = Router();

router.post('/login', validate(loginSchema), adminController.login);
router.post('/change-password', validate(changePasswordSchema), adminController.changePassword);

module.exports = router;
