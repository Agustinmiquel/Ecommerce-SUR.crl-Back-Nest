import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { JwtStrategy } from 'src/utils/jwt.strategy';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtStrategy],
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [CategoriesModule],
})
export class CategoriesModule {}
