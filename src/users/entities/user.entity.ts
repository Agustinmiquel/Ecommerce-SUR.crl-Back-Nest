import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  lastname: string;

  @Column('varchar', { unique: true, nullable: true })
  googleId?: number;

  @Column('varchar', { unique: true, nullable: true })
  facebookId?: number;

  @Column('text', { unique: true })
  email: string;

  @Column({ default: 'user' })
  role: string;

  @Column('varchar', { nullable: true })
  phone?: number;

  @Column({ default: 'true' })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
