import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  codigo: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('decimal', { default: 0.0 })
  price: number;

  @Column({ default: true })
  IsActive?: boolean;

  @Column('varchar', { default: 'default.png' })
  ImageProduct?: string;
}
