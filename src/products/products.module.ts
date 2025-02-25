import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CloudinaryService } from 'src/common/providers/cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService],
  imports: [TypeOrmModule.forFeature([Product, Category]), CategoriesModule],
})
export class ProductsModule {}
