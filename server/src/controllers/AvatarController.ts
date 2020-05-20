import 'reflect-metadata';
import { getConnection } from 'typeorm';
import fs from 'fs';
import tinify from 'tinify';
import { promisify } from 'util';
import { ErrorHandler } from '../middlewares/ErrorMiddleware';
import { User } from '../entities/UserEntity';

const readFile = promisify(fs.readFile);

export class AvatarController {
  constructor() {}

  /**
   * Upload user avatar
   *
   * @param req
   * @param res
   */
  public async uploadAvatar(req, res) {
    try {
      const fileName = req.file.filename;
      const userId = fileName.split('_')[0];
      const organizationHash = fileName.split('_')[1];
      // New avatar name, all images change to .png
      const avatarName = `${userId}_avatar.png`;

      // Set TinyPng API Access Key
      tinify.key = process.env.TINY_PNG!;
      tinify.validate(error => {
        // Validation of API key failed.
        if (error) {
          throw new ErrorHandler(500, `Error from avatar tinyPng: ${error}`);
        }
      });
      // Take image from file for TinyPng
      const source = tinify.fromFile(req.file.path);

      // Directory for avatar in storage
      const avatarDir = `${process.cwd()}/storage/organization/${organizationHash}/avatar/`;

      // Check if folder exist if not creat one
      if (!fs.existsSync(avatarDir)) {
        try {
          fs.mkdirSync(avatarDir, { recursive: true });
        } catch (error) {
          throw new ErrorHandler(500, `Error from Create logo dir: ${error}`);
        }
      }

      // Set compress  method and  max resolution
      const resized = source.resize({
        method: 'fit',
        width: 200,
        height: 200,
      });

      // TinyPng compress and save into another file with new name
      await resized.toFile(avatarDir + avatarName);

      setTimeout(() => {
        // Remove original image from /temp/avatar
        fs.unlink(req.file.path, err => {
          if (err) {
            throw new ErrorHandler(500, `Cannot deleted temp avatar image.`);
          }
        });
      }, 1000);

      // Link for save
      const saveAvatarDir = `organization/${organizationHash}/avatar/${avatarName}`;

      // Create user object
      const user = {
        avatar: saveAvatarDir,
      };

      // Find user based on id
      const currentUser = await getConnection()
        .getRepository(User)
        .findOne(userId);
      // Check if organization exists
      if (currentUser === undefined) {
        throw new ErrorHandler(500, `User doesn't exist.`);
      }

      const updatedUser = getConnection()
        .getRepository(User)
        .merge(currentUser, user);
      getConnection()
        .getRepository(User)
        .save(updatedUser);

      return res.status(200).json({
        status: 'true',
        message: saveAvatarDir,
      });
    } catch (err) {
      console.error('Error from uploadAvatar controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get user avatar
   *
   * @param req
   * @param res
   */
  public getAvatar(req, res) {
    try {
      // Take data from query param
      const avatarLink = req.query.avatar;

      // Check if !empty
      if (!avatarLink) {
        throw new ErrorHandler(500, `No link for user avatar.`);
      }

      const avatarDir = `${process.cwd()}/storage/${avatarLink}`;

      // Find logo in file system
      (async () => {
        try {
          // Read image
          const result = await readFile(avatarDir, 'base64');
          // Convert image into Base64
          const base64 = `data:image/png;base64,${result}`;

          // Send to client
          return res.status(200).json({
            status: 'true',
            message: base64,
          });
        } catch (error) {
          console.error(`Error send avatar to client: ${error}`);
          throw new ErrorHandler(500, `Error send avatar to client: ${error}`);
        }
      })();
    } catch (err) {
      console.error('Error from getAvatar controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }
}
