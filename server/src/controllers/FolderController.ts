import 'reflect-metadata';
import { getConnection } from 'typeorm';
import { Folder } from '../entities/FolderEntity';

export class FolderController {
  async getAll() {
    return getConnection()
      .getRepository(Folder)
      .find({ relations: ['files'] });
  }

  async getOne(id) {
    return getConnection()
      .getRepository(Folder)
      .findOne({ where: { id: id }, relations: ['files'] });
  }

  async create(folder: Folder) {
    let newFolder = getConnection()
      .getRepository(Folder)
      .create(folder);
    return getConnection()
      .getRepository(Folder)
      .save(newFolder);
  }

  async update(id, folder: Folder) {
    let currentFolder = await getConnection()
      .getRepository(Folder)
      .findOne(id);
    if (currentFolder === undefined) {
      return false;
    }
    let updatedFolder = getConnection()
      .getRepository(Folder)
      .merge(currentFolder, folder);
    return getConnection()
      .getRepository(Folder)
      .save(updatedFolder);
  }

  async delete(id) {
    if ((await this.getOne(id)) === undefined) {
      return false;
    }
    return getConnection()
      .getRepository(Folder)
      .delete(id);
  }
}
