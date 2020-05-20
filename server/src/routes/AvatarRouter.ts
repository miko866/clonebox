// import multer from 'multer';
import { AvatarController } from '../controllers/AvatarController';
import { checkAuthHeader } from '../middlewares/AuthMiddleware';
import { upload } from '../middlewares/multer/AvatarMulterMiddleware';

const express = require('express');

const router = express.Router();
const avatarController = new AvatarController();

export default function avatars() {
  /**
   * @swagger
   * /api/avatar:
   *  post:
   *    tags:
   *      - User
   *    security:
   *      - apiKeyAuth: []
   *    description: Upload user avatar
   *    consumes:
   *       - multipart/form-data
   *    produces:
   *       - application/json
   */
  router.post('/', checkAuthHeader, upload.single('file'), avatarController.uploadAvatar);

  /**
   * @swagger
   * /api/avatar:
   *  get:
   *    tags:
   *      - User
   *    security:
   *      - apiKeyAuth: []
   *    description: Get current user avatar
   *    produces:
   *       - application/json
   */
  // Get current user avatar
  router.get('/', checkAuthHeader, avatarController.getAvatar);

  return router;
}
