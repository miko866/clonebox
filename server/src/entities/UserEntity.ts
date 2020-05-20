import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './OrganizationEntity';
import { File } from './FileEntity';

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - first_name
 *          - last_name
 *          - email
 *          - password
 *          - organization
 *        properties:
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          email:
 *            type: string
 *          avatar:
 *            type: string
 *            description: Link to users avatar-picture.
 *          password:
 *            type: string
 *            format: password
 *          organization:
 *            oneOf:
 *              - $ref: '#/components/schemas/Organization'
 *          files:
 *            anyOf:
 *              - $ref: '#/components/schemas/File'
 *        example:
 *          id: 2
 *          first_name: Michael
 *          last_name: Schori
 *          email: fake@email.com
 *          password: sml12345
 *          organization: oneOf Organization
 */

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'text' })
  password: string;

  @ManyToOne(
    type => Organization,
    organization => organization.users,
  )
  organization: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @OneToMany(
    type => File,
    file => file.user,
  )
  files: File[];
}
