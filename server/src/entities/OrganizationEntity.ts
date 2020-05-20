import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './UserEntity';
import { File } from './FileEntity';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Organization:
 *        type: object
 *        required:
 *          - name
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          memory:
 *            type: number
 *            description: Remaining memory-space for this organization.
 *          password:
 *            type: string
 *            format: password
 *          users:
 *            anyOf:
 *              - $ref: '#/components/schemas/User'
 *          files:
 *            anyOf:
 *              - $ref: '#/components/schemas/File'
 *        example:
 *          id: 4
 *          name: Test AG
 *          memory: 12
 *          password: sml12345
 *          users: anyOf User
 *          files: anyOf File
 */

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column()
  memory: number;

  @Column({ type: 'varchar', length: '15', unique: true })
  hash: string;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @OneToMany(
    type => User,
    user => user.organization,
  )
  users: User[];

  @OneToMany(
    type => File,
    file => file.organization,
  )
  files: File[];
}
