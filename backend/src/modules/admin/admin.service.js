const bcrypt = require('bcrypt');

const adminRepository = require('./admin.repository');

class AdminServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AdminServiceError';
    this.statusCode = statusCode;
  }
}

const SALT_ROUNDS = 10;

const verifyPassword = async (password) => {
  const adminSettings = await adminRepository.getAdminSettings();

  if (!adminSettings) {
    throw new AdminServiceError('Admin settings were not found.', 500);
  }

  return bcrypt.compare(password, adminSettings.password_hash);
};

const changePassword = async ({ currentPassword, newPassword }) => {
  const isCurrentPasswordValid = await verifyPassword(currentPassword);

  if (!isCurrentPasswordValid) {
    throw new AdminServiceError('Current password is invalid.', 401);
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const updated = await adminRepository.updatePassword(newHash);

  if (!updated) {
    throw new AdminServiceError('Unable to update password.', 500);
  }

  return true;
};

module.exports = {
  AdminServiceError,
  verifyPassword,
  changePassword,
};
