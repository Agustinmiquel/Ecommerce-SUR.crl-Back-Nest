import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.productsId, {})
  @JoinColumn({ name: 'categoryId' })
  categoryId: Category;

  @Column('decimal', { default: 0.0 })
  price: number;

  @Column({ default: true })
  IsActive?: boolean;

  @Column('varchar', { default: 'default.png' })
  ImageProduct?: string;
}
