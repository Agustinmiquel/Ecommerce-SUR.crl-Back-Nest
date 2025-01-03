import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar', { unique: true })
  name: string;
}
