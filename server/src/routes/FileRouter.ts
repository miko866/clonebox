import { FileController } from '../controllers/FileController';
import { checkAuthHeader } from '../middlewares/AuthMiddleware';
import { upload } from '../middlewares/multer/FileMulterMiddleware';

const express = require('express');

const router = express.Router();
const fileController = new FileController();

export default function files() {

  /**
   * @swagger
   * /api/file:
   *  post:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - File
   *    description: Create new file
   *    consumes:
   *      - application/json
   *    parameters:
   *      - name: file
   *        description: File object
   *        in: body
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#components/schemas/File'
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: File successfully created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/File'
   */
  // Create file
  router.post('/', checkAuthHeader, upload.single('file'), fileController.createFile);

  /**
   * @swagger
   * /api/file/user/{id}:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - File
   *    description: Return all files from user
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
   *              $ref: '#/components/schemas/File'
   */
  // Get all files belows user
  router.get('/user/:id', checkAuthHeader, fileController.getAllFilesByUser);

  /**
   * @swagger
   * /api/file/organization/{id}:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - File
   *    description: Return all files from organization
   *    parameters:
   *      - name: id
   *        in: path
   *        description: Organization ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: Organization successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/File'
   */
  // Get all files belows organization
  router.get('/organization/:id', checkAuthHeader, fileController.getAllFilesByOrganization);

  // Download file
  router.get('/download', checkAuthHeader, fileController.downloadFile);

  /**
   * @swagger
   * /api/file/{id}:
   *  delete:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - File
   *    description: Delete one specific file
   *    parameters:
   *      - name: id
   *        in: path
   *        description: File ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: File successfully deleted
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/File'
   */
  // Delete file
  router.delete('/', checkAuthHeader, fileController.deleteFile);

  return router;
}
