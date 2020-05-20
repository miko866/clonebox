import {ErrorHandler} from './ErrorMiddleware';

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Check if JWT token agree with JWT secret key
 * @param {authorization} req
 * @param {none} res
 * @param {next step} next
 */
const checkAuthHeader = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (authToken) {
    try {
      const verified = jwt.verify(authToken, process.env.VUE_APP_SERVER_JWT_SECRET);

      if (verified) {
        next();
      } else {
        throw new ErrorHandler(500, 'Invalid token');
      }
    } catch (error) {
      console.error('Error from Auth token', error);
      res.status(401).json({ status: 401, error: 'Not authorized to access this resource checkAuthHeaderSetUser2' });
    }
  } else {
    return res.status(500).json({
      status: 'false',
      message: 'Invalid token',
    });
  }
};

/**
 * Check if routes exist if not show not found
 * @param {res} res
 * @param {next step} next
 */
const notFound = (req, res, next) => {
  const error = new Error('Not Found');
  res.status(404).send({ error: 'Not found' });
  next(error);
};

export { notFound, checkAuthHeader };
