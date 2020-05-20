import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';

const pattern = /^[a-zA-Z0-9@,:-_./ ]{3,25}$/;

const createSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .regex(pattern)
    .required(),
  memory: Joi.number().required(),
  hash: Joi.string()
    .trim()
    .max(15)
    .regex(pattern)
    .required(),
  password: Joi.string().required(),
});

const updateSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .regex(pattern)
    .allow(''),
  password: Joi.string().allow(''),
});

/**
 * Validate user input for organization
 *
 * @param req
 * @param res
 * @param next
 */
export const organization = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = createSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);
      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for create new organization: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from organization create validator ${err}`,
    });
  }
};

/**
 * Validate user input for organization
 *
 * @param req
 * @param res
 * @param next
 */
export const organizationUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take request.body for validation
    const result = updateSchema.validate(req.body);

    // Check errors
    if (result.error) {
      console.error('validator error response: ', result.error.details[0].message);

      return res.status(400).json({
        status: false,
        message: `Invalid input parameters for update  organization: ${result.error.details[0].message}`,
      });
    }

    // No error continue
    next();
  } catch (err) {
    console.error('error validation', err);
    return res.status(400).json({
      status: false,
      message: `Error from organization update validator: ${err}`,
    });
  }
};
