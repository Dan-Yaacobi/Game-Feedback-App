const { ZodError } = require('zod');

const SOURCE_BY_METHOD = {
  GET: 'query',
  DELETE: 'params',
};

const buildValidationError = (issues) => {
  const error = new Error('Validation failed');
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  return error;
};

const validate = (schema, explicitSource) => {
  return (req, res, next) => {
    const source = explicitSource || SOURCE_BY_METHOD[req.method] || 'body';

    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(buildValidationError(error.issues));
      }

      return next(error);
    }
  };
};

module.exports = {
  validate,
};
