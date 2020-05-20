// Error Handler
class ErrorHandler extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * handleError() handle all app error on one place
 * @param {Object} err
 * @param res
 * @param next
 * @return {Object} res error
 */
const handleError = (err, res, next) => {
  const { statusCode, message } = err;
  return res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
};

export { ErrorHandler, handleError };
