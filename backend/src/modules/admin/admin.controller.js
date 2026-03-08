const adminService = require('./admin.service');

const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const success = await adminService.verifyPassword(password);

    return res.json({
      success: true,
      data: {
        authenticated: success,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await adminService.changePassword({ currentPassword, newPassword });

    return res.json({
      success: true,
      data: {
        passwordChanged: true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  changePassword,
};
