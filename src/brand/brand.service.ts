import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(@InjectRepository(Brand) private readonly brandRepository) {}
  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  async findAll() {
    return await this.brandRepository.findAll();
  }

  async findOne(id: number) {
    return await this.brandRepository.findOne(id);
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  async remove(id: number) {
    return await this.brandRepository.remove(id);
  }
}
