import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './OrganizationEntity';
import { User } from './UserEntity';
import { Folder } from './FolderEntity';

/**
 * @swagger
 *  components:
 *    schemas:
 *      File:
 *        type: object
 *        required:
 *          - name
 *          - type
 *          - path
 *          - organization
 *          - user
 *        properties:
 *          name:
 *            type: string
 *          type:
 *            type: string
 *          size:
 *            type: number
 *          path:
 *            type: string
 *          organization:
 *            oneOf:
 *              - $ref: '#/components/schemas/Organization'
 *          user:
 *            oneOf:
 *              - $ref: '#/components/schemas/User'
 *          folder:
 *            oneOf:
 *              - $ref: '#/components/schemas/Folder'
 *        example:
 *          id: 1
 *          name: Testfile
 *          type: png
 *          size: 54
 *          path: url/path/to/file
 *          organization: oneOf Organization
 *          user: oneOf User
 *          folder: oneOf Folder
 */


@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'float' })
  size: number;

  @Column({ type: 'varchar' })
  path: string;

  @ManyToOne(
    type => Organization,
    organization => organization.files,
  )
  organization: number;

  @ManyToOne(
    type => User,
    user => user.files,
  )
  user: number;

  @ManyToOne(
    type => Folder,
    folder => folder.files,
  )
  folder: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}
