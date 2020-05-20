import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { File } from './FileEntity';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Folder:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *          files:
 *            anyOf:
 *              - $ref: '#/components/schemas/File'
 *        example:
 *          id: 5
 *          name: my_files
 *          files: anyOf File
 */

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @OneToMany(
    type => File,
    file => file.folder,
  )
  files: File[];
}
