import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as XSLS from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { Like } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectRepository(Product) private readonly productRepository,
    @InjectRepository(Category) private readonly categoryRepository,
  ) {}
  async create(createProductDto: CreateProductDto) {
    return await this.productRepository.create(createProductDto);
  }

  async findAll(page: number, limit: number): Promise<Product> {
    const skip = (page - 1) * limit;
    return await this.productRepository.find({
      skip: skip,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOne({ where: { id: id } });
    } catch (error) {
      this.logger.error(`Error al buscar el producto: ${error.message}`);
    }
  }

  async findByCategory(categoryName: string): Promise<Product[] | undefined> {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!category || null) {
      throw new Error(`No existe la category: ${categoryName}`);
    }
    return await this.productRepository.find({
      where: { categoryId: category },
    });
  }

  async findByCode(code: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { codigo: code },
    });
    if (!product) {
      this.logger.error(`No existe el producto con código: ${code}`);
      throw new NotFoundException(`No existe el producto con código: ${code}`);
    }
    return product;
  }

  // Buscar por nombre del producto
  async searchProduct(name: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { name: Like(`%${name}%`) },
    });
    return products;
  }

  // Contar productos elegidos y generar pdf.

  // Actualizar imagen por producto

  // Actualizar imagenes de productos

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }

  async cargaProducts(file: Express.Multer.File) {
    const excel = XSLS.read(file.buffer, { type: 'buffer' });
    const hojaCodigo = excel.SheetNames[0];
    const hoja = excel.Sheets[hojaCodigo];
    const datos = XSLS.utils.sheet_to_json(hoja);

    for (const data of datos) {
      const productDto: CreateProductDto = {
        codigo: data['codigo'] ? data['codigo'].trim() : null,
        name: data['name'] ? data['name'].trim() : null,
        categoryId: data['categoryId'] ? data['categoryId'].trim() : null,
        price: data['price'] ? parseFloat(data['price'].trim()) : 0.0,
        IsActive: data['IsActive'] ? data['IsActive'] === 'true' : true,
        ImageProduct: data['ImageProduct']
          ? data['ImageProduct'].trim()
          : 'default.png',
      };

      if (data['name']) {
        const existProduct = await this.productRepository.findOne({
          where: { name: productDto.name },
        });
        if (existProduct) {
          this.logger.log(
            `Producto con nombre ${productDto.name} ya existe. Omitiendo...`,
          );
          continue;
        }
      }

      let category = await this.categoryRepository.findOne({
        where: { name: productDto.categoryId },
      });
      if (!category) {
        const createCategoryDto: CreateCategoryDto = {
          name: productDto.categoryId,
        };
        category = this.categoryRepository.create(createCategoryDto);
        await this.categoryRepository.save(category);
        this.logger.log(
          `Categoría con nombre ${productDto.categoryId} creada.`,
        );
      }

      try {
        const product = this.productRepository.create(productDto);
        await this.productRepository.save(product);
      } catch (error) {
        this.logger.error(`Error al cargar los productos: ${error.message}`);
        throw new Error(error.message);
      }
    }
  }
}
