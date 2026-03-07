const notFoundMiddleware = (_req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
    },
  });
};

module.exports = {
  notFoundMiddleware,
};
