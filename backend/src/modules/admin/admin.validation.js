const { z } = require('zod');

const loginSchema = z
  .object({
    password: z.string().min(4),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(4),
    newPassword: z.string().min(6),
  })
  .strict();

module.exports = {
  loginSchema,
  changePasswordSchema,
};
