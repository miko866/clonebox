import 'reflect-metadata';
import { getConnection } from 'typeorm';
import du from 'du';
import fs from 'fs';
import { ErrorHandler } from '../middlewares/ErrorMiddleware';
import { Organization } from '../entities/OrganizationEntity';
import { passwordHashed } from '../utils/Helpers';

export class OrganizationController {
  constructor() {}

  /**
   * Create new organization
   *
   * @param req
   * @param res
   */
  public async createOrganization(req, res) {
    try {
      const organization = req.body;

      // Check if organization exists
      const checkOrganization = await getConnection()
        .getRepository(Organization)
        .findOne({ where: { name: organization.name } });
      // If exists send error
      if (checkOrganization) {
        throw new ErrorHandler(500, 'Organization already exists');
      }

      // Hashed password
      organization.password = await passwordHashed(organization.password);

      // Create new organization
      const newOrganization = await getConnection()
        .getRepository(Organization)
        .create(organization);
      // Save new organization
      const savedOrganization = await getConnection()
        .getRepository(Organization)
        .save(newOrganization);

      // For new organization create storage with unique hash
      const dir = `${process.cwd()}/storage/organization/${savedOrganization.hash}/`;
      // Check if folder exist if not creat one
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
          throw new ErrorHandler(500, `Error from Create organization dir: ${error}`);
        }
      }

      // Send response without password
      const organizationResponse = {
        id: savedOrganization.id,
        name: savedOrganization.name,
        memory: savedOrganization.memory,
        hash: savedOrganization.hash,
      };
      return res.status(200).json({
        status: 'true',
        message: organizationResponse,
      });
    } catch (err) {
      console.error('Error from createOrganization Controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get one organization
   *
   * @param req
   * @param res
   */
  public async getOneOrganization(req, res) {
    try {
      // Take organization_id from url
      const organizationId = parseInt(req.params.id, 10);

      // Find organization depends on id
      const organization = await getConnection()
        .getRepository(Organization)
        .findOne({ where: { id: organizationId }, relations: ['users'] });
      // Check if organization with current id exists
      if (organization === undefined) {
        throw new ErrorHandler(500, `Organization doesn't exist.`);
      }

      // Send response without password
      const organizationResponse = {
        id: organization.id,
        name: organization.name,
        memory: organization.memory,
        hash: organization.hash,
        users: organization.users,
      };
      return res.status(200).json({
        status: 'true',
        message: organizationResponse,
      });
    } catch (err) {
      console.error('Error from getOneOrganization controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get all organizations
   *
   * @param req
   * @param res
   */
  public async getAllOrganizations(req, res) {
    try {
      const allOrganizations = await getConnection()
        .getRepository(Organization)
        .find({ relations: ['users'] });

      // Check if not empty
      if (allOrganizations.length === 0) {
        throw new ErrorHandler(500, 'No organizations exists');
      }

      // Create response without password
      const organizationsResponse: any[] = [];
      allOrganizations.forEach(data => {
        const id = data.id;
        const name = data.name;
        const memory = data.memory;
        const hash = data.hash;
        const users = data.users;
        organizationsResponse.push({ id, name, memory, hash, users });
      });

      // Send response to client with data
      return res.status(200).json({
        status: 'true',
        message: organizationsResponse,
      });
    } catch (err) {
      console.error('Error from getAllOrganizations controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Get storage
   * storage/organization/<organization_hash>/
   * @param req
   * @param res
   */
  public async getStorage(req, res) {
    try {
      // Take organization_id from url
      const organizationHash = req.params.hash;

      const dir = `${process.cwd()}/storage/organization/${organizationHash}/`;

      // Folder size in Byte
      const size = await du(dir);
      // Convert to MB
      const memory = parseFloat((size / 1024 / 1024).toFixed(2));

      // Send response to client with data
      return res.status(200).json({
        status: 'true',
        message: memory,
      });
    } catch (err) {
      console.error('Error from getStorage controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Update organization
   *
   * @param req
   * @param res
   */
  public async updateOrganization(req, res) {
    try {
      // Take organization_id from url
      const organizationId = parseInt(req.params.id, 10);

      const organization = req.body;

      // Find organization based on id
      const currentOrganization = await getConnection()
        .getRepository(Organization)
        .findOne(organizationId);
      // Check if organization exists
      if (currentOrganization === undefined) {
        throw new ErrorHandler(500, `Organization doesn't exist.`);
      }

      // Hashed password
      organization.password = await passwordHashed(organization.password);

      const updatedOrganization = getConnection()
        .getRepository(Organization)
        .merge(currentOrganization, organization);
      getConnection()
        .getRepository(Organization)
        .save(updatedOrganization);

      return res.status(200).json({
        status: 'true',
        message: `Organization was updated `,
      });
    } catch (err) {
      console.error('Error ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }

  /**
   * Delete organization
   *
   * @param req
   * @param res
   */
  public async deleteOrganization(req, res) {
    try {
      // Take organization_id from url
      const organizationId = parseInt(req.params.id, 10);

      // Find organization depends on id
      const organization = await getConnection()
        .getRepository(Organization)
        .findOne({ where: { id: organizationId } });
      if (organization === undefined) {
        throw new ErrorHandler(500, `Organization doesn't exist.`);
      }

      // Delete organization
      await getConnection()
        .getRepository(Organization)
        .delete(organizationId);

      return res.status(200).json({
        status: 'true',
        message: `Organization was successfully removed.`,
      });
    } catch (err) {
      console.error('Error from deleteOrganizations controller: ', err);
      return res.status(500).json({
        status: 'false',
        message: `Server Error: ${err}`,
      });
    }
  }
}
