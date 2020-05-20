import { FolderController } from '../controllers/FolderController';

export default function folders() {
  let express = require('express');
  let router = express.Router();
  let folderController = new FolderController();

  /**
   * @swagger
   * /api/folder:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Folder
   *    description: Return all folders
   *    responses:
   *      200:
   *        description: Folders successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                anyOf:
   *                  - $ref: '#/components/schemas/Folder'
   */
  router.get('/', async function(req, res) {
    const folders = await folderController.getAll();
    res.json(folders);
  });

  /**
   * @swagger
   * /api/folder/{id}:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Folder
   *    description: Return one specific folder
   *    parameters:
   *      - name: id
   *        in: path
   *        description: folder ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: Folder successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Folder'
   */
  router.get('/:id', async function(req, res) {
    const folder = await folderController.getOne(req.params.id);
    if (folder === undefined) {
      res.status(404).send();
    } else {
      res.json(folder);
    }
  });

  /**
   * @swagger
   * /api/folder:
   *  post:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Folder
   *    description: Create new folder
   *    consumes:
   *      - application/json
   *    parameters:
   *      - name: folder
   *        description: Folder object
   *        in: body
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#components/schemas/Folder'
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Folder successfully created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Folder'
   */
  router.post('/', async function(req, res) {
    const folder = await folderController.create(req.body);
    if (folder === undefined) {
      res.status(400).send();
    } else {
      res.json(folder);
    }
  });

  /**
   * @swagger
   * /api/folder/{id}:
   *  put:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Folder
   *    description: Update one specific folder
   *    parameters:
   *      - name: id
   *        in: path
   *        description: Folder ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: Folder successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Folder'
   */
  router.put('/:id', async function(req, res) {
    const folder = await folderController.update(req.params.id, req.body);
    if (folder === false) {
      res.status(400).send();
    } else {
      res.json(folder);
    }
  });

  /**
   * @swagger
   * /api/folder/{id}:
   *  delete:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Folder
   *    description: Delete one specific folder
   *    parameters:
   *      - name: id
   *        in: path
   *        description: Folder ID
   *        required: true
   *        schema:
   *          type: integer
   *          format: int64
   *    responses:
   *      200:
   *        description: Folder successfully deleted
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Folder'
   */
  router.delete('/:id', async function(req, res) {
    if ((await folderController.delete(req.params.id)) === false) {
      res.status(400).send();
    } else {
      res.status(200).send();
    }
  });

  return router;
}
