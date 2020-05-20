import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';

const pattern = /^[a-zA-Z0-9@,:-_./ ]{3,25}$/;
const createSchema = Joi.object().keys({
  first_name: Joi.string()
    .trim()
    .regex(pattern)
    .required(),
  last_name: Joi.string()
    .trim()
    .regex(pattern)
    .required(),
  email: Joi.string()
    .email()
    .trim()
    .regex(pattern)
    .required(),
  avatar: Joi.string()
    .trim()
    .regex(pattern)
    .allow(''),
  password: Joi.string().required(),
  organization_name: Joi.string()
    .trim()
    .required(),
});

const updateSchema = Joi.object().keys({
  first_name: Joi.string()
    .trim()
    .regex(pattern),
  last_name: Joi.string()
    .trim()
    .regex(pattern),
  avatar: Joi.string()
    .trim()
    .regex(pattern),
  password: Joi.string(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .trim()
    .regex(pattern)
    .required(),
  password: Joi.string().required(),
});

const tokenSchema = Joi.object().keys({
  token: Joi.string()
    .trim()
    .required(),
});

/**
 * Validate user input for user
 *
 * @param req
 * @param res
 * @param next
 */
export const user = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = createSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);

      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for created new user: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from user create validator: ${err}`,
    });
  }
};

/**
 * Validate user input fo user
 *
 * @param req
 * @param res
 * @param next
 */
export const userUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = updateSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);

      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for update  user: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from user update validator ${err}`,
    });
  }
};

/**
 * Validate user input fo user
 *
 * @param req
 * @param res
 * @param next
 */
export const userLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = loginSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);

      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for login user: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from user login validator ${err}`,
    });
  }
};

/**
 * Validate for user Token
 *
 * @param req
 * @param res
 * @param next
 */
export const userToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = tokenSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);

      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for token user: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from user token validator ${err}`,
    });
  }
};
