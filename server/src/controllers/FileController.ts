import 'reflect-metadata';
import { getConnection } from 'typeorm';
import fs from 'fs';
import mime from 'mime-types';
import { File } from '../entities/FileEntity';
import { ErrorHandler } from '../middlewares/ErrorMiddleware';

export class FileController {
  constructor() {}

  /**
   * Create new file
   *
   * @param req
   * @param res
   */
  public async createFile(req, res) {
    try {
      if (req.file === '' || req.file === null || req.file === undefined) {
        throw new ErrorHandler(500, `Invalid file to save.`);
      }

      const fileName = req.file.filename;
      const filePath = req.file.path;

      // Data for DB
      const name = req.file.originalname.split('.')[0];
      const type = req.file.originalname.split('.')[1];
      const size = req.file.size;
      const path = filePath
        .split('/')
        .slice(1, 5)
        .join('/');
      const organization = parseInt(fileName.split('_')[1], 10);
      const user = parseInt(fileName.split('_')[0], 10);

      // Create file object
      const file = {
        name,
        type,
        size,
        path,
        organization,
        user,
      };

      const createFile = await getConnection()
        .getRepository(File)
        .create(file);

      await getConnection()
        .getRepository(File)
        .save(createFile);

      return res.status(200).json({
        status: 'true',
        message: 'File was successfully saved.',
      });
    } catch (err) {
      console.error('Error from createFile controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get all files depends on user id
   *
   * @param req
   * @param res
   */
  public async getAllFilesByUser(req, res) {
    try {
      // Take user_id from url
      const userId = parseInt(req.params.id, 10);

      const files = await getConnection()
        .getRepository(File)
        .find({ relations: ['user'], where: { user: userId } });

      // Check if not empty
      if (files.length === 0) {
        throw new ErrorHandler(500, 'No file exists');
      }

      // Create response
      const fileResponse: any[] = [];
      files.forEach(file => {
        const id = file.id;
        const name = file.name;
        const type = file.type;
        const size = (file.size / 1024 / 1024).toFixed(2);
        const path = file.path;
        const date = file.updatedAt
          .toLocaleDateString()
          .replace('/', '.')
          .replace('/', '.')
          .split('.');
        const modified = `${date[1]}.${date[0]}.${date[2]}`;
        const author = `${file.user.first_name} ${file.user.last_name}`;
        const userId = file.user.id;

        fileResponse.push({ id, name, type, size, path, modified, author, userId });
      });

      return res.status(200).json({
        status: 'true',
        message: fileResponse,
      });
    } catch (err) {
      console.error('Error from getAllFilesByUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get all files depends on organization id
   *
   * @param req
   * @param res
   */
  public async getAllFilesByOrganization(req, res) {
    try {
      // Take organization_id from url
      const organizationId = parseInt(req.params.id, 10);

      const files = await getConnection()
        .getRepository(File)
        .find({ relations: ['user'], where: { organization: organizationId } });

      // Check if not empty
      if (files.length === 0) {
        throw new ErrorHandler(500, 'No file exists');
      }

      // Create response
      const fileResponse: any[] = [];
      files.forEach(file => {
        const id = file.id;
        const name = file.name;
        const type = file.type;
        const size = (file.size / 1024 / 1024).toFixed(2);
        const path = file.path;
        const date = file.updatedAt
          .toLocaleDateString()
          .replace('/', '.')
          .replace('/', '.')
          .split('.');
        const modified = `${date[1]}.${date[0]}.${date[2]}`;
        const author = `${file.user.first_name} ${file.user.last_name}`;
        const userId = file.user.id;

        fileResponse.push({ id, name, type, size, path, modified, author, userId });
      });

      return res.status(200).json({
        status: 'true',
        message: fileResponse,
      });
    } catch (err) {
      console.error('Error from getAllFilesByUser controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Delete file depends on id
   *
   * @param req
   * @param res
   */
  public async deleteFile(req, res) {
    try {
      // File
      const fileData = JSON.parse(req.query.file);

      const id = fileData.id;
      const path = fileData.path;

      // Set file dir
      const dir = `${process.cwd()}/storage/${path}`;
      // Delete file from storage
      fs.unlink(dir, error => {
        if (error) {
          throw new ErrorHandler(500, 'Error from delete file.');
        }
      });

      // Find file depends on id
      const file = await getConnection()
        .getRepository(File)
        .findOne({ where: { id } });
      if (file === undefined) {
        throw new ErrorHandler(500, `File doesn't exist.`);
      }

      // Delete file
      await getConnection()
        .getRepository(File)
        .delete(id);

      // Send response
      return res.status(200).json({
        status: 'true',
        message: 'File was deleted',
      });
    } catch (err) {
      console.error('Error from deleteFile controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Download file
   *
   * @param req
   * @param res
   */
  public async downloadFile(req, res) {
    try {
      // File path
      const filePath = req.query.path;
      const fileName = filePath.split('/')[3].split('_')[2];
      const type = filePath.split('.')[1];

      // Find the right mime-type base on file type
      const contentType = mime.lookup(type);

      // Set file dir
      const dir = `${process.cwd()}/storage/${filePath}`;

      // Read file
      const file = fs.createReadStream(dir);
      const stat = fs.statSync(dir);

      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      // Send file to client
      file.pipe(res);
    } catch (err) {
      console.error('Error from downloadFile controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }
}
