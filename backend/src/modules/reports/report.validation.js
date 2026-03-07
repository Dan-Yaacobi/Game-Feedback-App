const { z } = require('zod');

const REPORT_TYPES = ['bug', 'suggestion', 'balance_issue'];
const REPORT_STATUSES = ['open', 'investigating', 'closed'];

const createReportSchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1),
    report_type: z.enum(REPORT_TYPES),
    player_email: z.string().email().optional(),
    player_name: z.string().trim().max(100).optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

const updateStatusSchema = z
  .object({
    status: z.enum(REPORT_STATUSES),
  })
  .strict();

const listReportsQuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().default(20),
    page: z.coerce.number().int().positive().default(1),
    status: z.enum(REPORT_STATUSES).optional(),
    report_type: z.enum(REPORT_TYPES).optional(),
  })
  .strict();

module.exports = {
  createReportSchema,
  updateStatusSchema,
  listReportsQuerySchema,
};
