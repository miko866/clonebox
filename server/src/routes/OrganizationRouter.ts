import * as validatorMiddleware from '../middlewares/validators/OrganizationValidator';
import { OrganizationController } from '../controllers/OrganizationController';
import { checkAuthHeader } from '../middlewares/AuthMiddleware';

const express = require('express');

const router = express.Router();
const organizationController = new OrganizationController();

export default function organizations() {

  /**
   * @swagger
   * /api/organization:
   *  post:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Organization
   *    description: Create new organization
   *    consumes:
   *      - application/json
   *    parameters:
   *      - name: organization
   *        description: Organization object
   *        in: body
   *        required: true
   *        type: string
   *        schema:
   *          $ref: '#components/schemas/Organization'
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Organization successfully created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Organization'
   */
  // Create organization
  router.post('/', validatorMiddleware.organization, organizationController.createOrganization);

  /**
   * @swagger
   * /api/organization/{id}:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Organization
   *    description: Return one specific organization
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
   *              $ref: '#/components/schemas/Organization'
   */
  // Get one organization
  router.get('/:id', organizationController.getOneOrganization);

  /**
   * @swagger
   * /api/organization:
   *  get:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Organization
   *    description: Return all organizations
   *    responses:
   *      200:
   *        description: Organizations successfully returned
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                anyOf:
   *                  - $ref: '#/components/schemas/Organization'
   */
  // Get all organizations
  router.get('/', organizationController.getAllOrganizations);

  // Get organization storage
  router.get('/storage/:hash', checkAuthHeader, organizationController.getStorage);

  /**
   * @swagger
   * /api/organization/{id}:
   *  put:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Organization
   *    description: Update one specific organization
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
   *        description: Organization successfully updated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Organization'
   */
  // Update organization
  router.put('/:id', validatorMiddleware.organizationUpdate, organizationController.updateOrganization);

  /**
   * @swagger
   * /api/organization/{id}:
   *  delete:
   *    security:
   *      - apiKeyAuth: []
   *    tags:
   *      - Organization
   *    description: Delete one specific organization
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
   *        description: Organization successfully deleted
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Organization'
   */
  // Delete organization
  router.delete('/:id', organizationController.deleteOrganization);

  return router;
}
