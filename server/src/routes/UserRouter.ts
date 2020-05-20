import * as validatorMiddleware from '../middlewares/validators/UserValidator';
import { UserController } from '../controllers/UserController';
import { checkAuthHeader } from '../middlewares/AuthMiddleware';

const express = require('express');

const router = express.Router();
const userController = new UserController();

export default function users() {

  /**
   * @swagger
   * /api/user:
   *  post:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - User
   *    description: Create new user
   *    consumes:
   *      - application/json
   *    parameters:
   *      - name: user
   *        description: User object
   *        in: body
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#components/schemas/User'
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: User successfully created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   */
  router.post('/', validatorMiddleware.user, userController.createUser);

  /**
   * @swagger
   * /api/user/login:
   *  post:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - User
   *    description: Login to account
   *    requestBody:
   *      description: Username and password.
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *              password:
   *                type: string
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: User successfully created
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                message:
   *                  type: string
   */
  // Login with user
  router.post('/login', validatorMiddleware.userLogin, userController.loginUser);

  // Verified user token
  router.post('/verifiedToken', checkAuthHeader, validatorMiddleware.userToken, userController.verifyUser);

  /**
   * @swagger
   * /api/user/{id}:
   *  put:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - User
   *    description: Update one specific user
   *    parameters:
   *      - name: id
   *        in: path
   *        description: User ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: User successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   */
  // Update user
  router.put('/:id', validatorMiddleware.userUpdate, userController.updateUser);

  /**
   * @swagger
   * /api/user/{id}:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - User
   *    description: Return one specific user
   *    parameters:
   *      - name: id
   *        in: path
   *        description: User ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: User successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   */
  // Get one user
  router.get('/:id', userController.getOneUser);

  /**
   * @swagger
   * /api/user:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - User
   *    description: Return all users
   *    responses:
   *      200:
   *        description: Users successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                anyOf:
   *                  - $ref: '#/components/schemas/User'
   */
  // Get all Users
  router.get('/', userController.getAllUsers);

  return router;
}
