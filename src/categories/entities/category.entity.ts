import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { unique: true, nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  imageCategory?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
