import 'reflect-metadata';
import { getConnection } from 'typeorm';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../middlewares/ErrorMiddleware';
import { User } from '../entities/UserEntity';
import { Organization } from '../entities/OrganizationEntity';
import { passwordHashed, comparePassword, validateEmail, jwtSignUser } from '../utils/Helpers';

export class UserController {
  constructor() {}

  /**
   * Create new user
   *
   * @param req
   * @param res
   */
  public async createUser(req, res) {
    try {
      const user = req.body;

      //  Find if email already exists in DB
      const email = await getConnection()
        .getRepository(User)
        .find({ where: { email: user.email } });

      // Check email
      if (!validateEmail(user.email)) {
        throw new ErrorHandler(500, `Email isn't valid`);
      }

      // If exists response false
      if (!isEmpty(email)) {
        throw new ErrorHandler(500, 'Email already exists.');
      }

      // Find organization depends on name
      const organization = await getConnection()
        .getRepository(Organization)
        .findOne({ where: { name: user.organization_name } });
      // No organization
      if (organization === undefined) {
        throw new ErrorHandler(500, 'No organization with id');
      }

      // Hashed password
      const hashedPassword = await passwordHashed(user.password);
      user.password = hashedPassword;

      user.organization = organization.id;

      // Create new user
      const newUser = await getConnection()
        .getRepository(User)
        .create(user);
      // Save new user
      const savedUser = await getConnection()
        .getRepository(User)
        .save(newUser);

      // Send response without password
      const userResponse = {
        id: savedUser.id,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
        email: savedUser.email,
        avatar: savedUser.avatar,
        organization: savedUser.organization,
      };
      return res.status(200).json({
        status: 'true',
        message: userResponse,
      });
    } catch (err) {
      console.error('Error from createUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Login current user
   *
   * @param req
   * @param res
   */
  public async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      // Find user depends on id
      const user = await getConnection()
        .getRepository(User)
        .findOne({ where: { email }, relations: ['organization'] });
      // Check if user with email exists
      if (user === undefined) {
        throw new ErrorHandler(401, 'error.signIn');
      }

      const isPasswordValid = await comparePassword(user.password, password);
      // Check valid password
      if (!isPasswordValid) {
        throw new ErrorHandler(401, 'error.signIn');
      }

      const userData = {
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        avatar: user.avatar,
        organizationId: user.organization.id,
        organizationName: user.organization.name,
        organizationMemory: user.organization.memory,
        organizationHash: user.organization.hash,
      };

      const token = jwtSignUser(userData);

      // Send JWT Token per header and make redirect to app
      return res
        .header('authorization', token)
        .status(200)
        .json({
          status: 'true',
          message: token,
        });
    } catch (err) {
      console.error('Error from loginUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Verify logged user
   *
   * @param req
   * @param res
   */
  public async verifyUser(req, res) {
    try {
      const { token } = req.body;
      // Verify JWT Token
      const verified = jwt.verify(token, process.env.VUE_APP_SERVER_JWT_SECRET);

      if (verified) {
        return res.status(200).json({
          status: 'true',
          message: verified,
        });
      }
      throw new ErrorHandler(500, 'Invalid Token');
    } catch (err) {
      console.error('Error from verifyUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `invalid Token: ${err}`,
      });
    }
  }

  /**
   * Get one user
   *
   * @param req
   * @param res
   */
  public async getOneUser(req, res) {
    try {
      // Take user_id from url
      const userId = parseInt(req.params.id, 10);

      // Find user depends on id
      const user = await getConnection()
        .getRepository(User)
        .findOne({ where: { id: userId }, relations: ['organization'] });
      // Check if user with current id exists
      if (user === undefined) {
        throw new ErrorHandler(500, `User doesn't exist.`);
      }

      // Send response without password
      const userResponse = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
        organization: user.organization,
      };
      return res.status(200).json({
        status: 'true',
        message: userResponse,
      });
    } catch (err) {
      console.error('Error from getOneUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Error from getOneUser controller: ${err}`,
      });
    }
  }

  /**
   * Get all users
   *
   * @param req
   * @param res
   */
  public async getAllUsers(req, res) {
    try {
      const allUsers = await getConnection()
        .getRepository(User)
        .find({ relations: ['organization'] });

      // Check if not empty
      if (allUsers.length === 0) {
        throw new ErrorHandler(500, 'No users exists');
      }

      // Create response without password
      const usersResponse = [];
      allUsers.forEach(data => {
        const id = data.id;
        const first_name = data.first_name;
        const last_name = data.last_name;
        const email = data.email;
        const avatar = data.avatar;
        const organization = data.organization;
        usersResponse.push({ id, first_name, last_name, email, avatar, organization });
      });
      return res.status(200).json({
        status: 'true',
        message: usersResponse,
      });
    } catch (err) {
      console.error('Error from getAllUsers controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Error from getAllUsers controller: ${err}`,
      });
    }
  }

  /**
   * Update user
   *
   * @param req
   * @param res
   */
  public async updateUser(req, res) {
    try {
      // Take user_id from url
      const userId = parseInt(req.params.id, 10);

      const user = req.body;

      // Find user based on id
      const currentUser = await getConnection()
        .getRepository(User)
        .findOne(userId);
      // Check if organization exists
      if (currentUser === undefined) {
        throw new ErrorHandler(500, `User doesn't exist.`);
      }

      // Hashed password
      user.password = await passwordHashed(user.password);

      const updatedUser = getConnection()
        .getRepository(User)
        .merge(currentUser, user);
      getConnection()
        .getRepository(User)
        .save(updatedUser);

      return res.status(200).json({
        status: 'true',
        message: `User was updated `,
      });
    } catch (err) {
      console.error('Error ', err);
      return res.status(500).json({
        status: 'false',
        message: `Error from updateUser controller: ${err}`,
      });
    }
  }

  /**
   * Delete user
   *
   * @param req
   * @param res
   */
  public async deleteUser(req, res) {
    try {
      // Take user_id from url
      const userId = parseInt(req.params.id, 10);

      // Find user depends on id
      const user = await getConnection()
        .getRepository(User)
        .findOne({ where: { id: userId } });
      if (user === undefined) {
        throw new ErrorHandler(500, 'No users exists');
      }

      // Delete user
      await getConnection()
        .getRepository(User)
        .delete(userId);

      return res.status(200).json({
        status: 'true',
        message: `User was successfully removed.`,
      });
    } catch (err) {
      console.error('Error from deleteUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Error from deleteUser controller: ${err}`,
      });
    }
  }
}
