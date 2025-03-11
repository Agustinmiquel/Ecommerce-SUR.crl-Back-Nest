import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as XSLS from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { ILike } from 'typeorm';

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
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOne({ where: { id: id } });
    } catch (error) {
      this.logger.error(`Error al buscar el producto: ${error.message}`);
    }
  }

  async findByCategory(name: string): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: ILike(name) },
    });
    if (!category) {
      this.logger.error(`No existe la categoría: ${name}`);
      throw new NotFoundException(`No existe la categoría: ${name}`);
    }
    return await this.productRepository.find({
      where: { category: { id: category.id } },
      relations: ['category'],
    });
  }

  async findByCode(code: number): Promise<Product[]> {
    const regex = /^30\d+/;
    const regexCode = /^code\d+/;

    if (!regex.test(code.toString()) && regexCode.test(code.toString())) {
      this.logger.error(`El código del producto no es válido: ${code}`);
      throw new NotFoundException(
        `El código del producto no es válido: ${code}`,
      );
    }

    const product = await this.productRepository.find({
      where: { codigo: ILike(`%${code}%`) },
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
      where: { name: ILike(`%${name}%`) },
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
      const codigo = data['codigo'] ? String(data['codigo']).trim() : null;
      const name = data['name'] ? String(data['name']).trim() : null;
      const categoryName = data['category']
        ? String(data['category']).trim()
        : null;
      const price = data['price'] ? parseFloat(data['price']) : 0.0;
      const isActive = data['IsActive']
        ? String(data['IsActive']).toLowerCase() === 'true'
        : true;
      const imageProduct = data['ImageProduct']
        ? String(data['ImageProduct']).trim()
        : 'default.png';

      if (data['name']) {
        const existProduct = await this.productRepository.findOne({
          where: { name: name },
        });
        if (existProduct) {
          this.logger.log(
            `Producto con nombre ${name} ya existe. Omitiendo...`,
          );
          continue;
        }
      }

      let category = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (!category) {
        this.logger.error(`No existe la categoría: ${categoryName}`);
        continue;
      }

      try {
        const product = this.productRepository.create({
          codigo,
          name,
          category,
          price,
          isActive,
          imageProduct,
        });
        await this.productRepository.save(product);
      } catch (error) {
        this.logger.error(`Error al cargar los productos: ${error.message}`);
        throw new Error(error.message);
      }
    }
  }

  async actualizarCategoriaProducto(file: Express.Multer.File) {
    const excel = XSLS.read(file.buffer, { type: 'buffer' });
    const hojaCodigo = excel.SheetNames[0];
    const hoja = excel.Sheets[hojaCodigo];
    const datos = XSLS.utils.sheet_to_json(hoja);

    // 🔍 Cargar todas las categorías una sola vez
    const categorias = await this.categoryRepository.find();
    const categoriaMap = new Map(
      categorias.map((cat) => [cat.name.trim().toLowerCase(), cat.id]),
    );

    for (const data of datos) {
      const productName = data['name'] ? String(data['name']).trim() : null;
      const categoryName = data['category']
        ? String(data['category']).trim().toLowerCase()
        : null;

      if (!productName || !categoryName) {
        this.logger.warn(
          `Producto sin nombre o categoría: ${JSON.stringify(data)}`,
        );
        continue;
      }

      // 🔎 Buscar el ID de la categoría en el mapa (sin consulta extra a la BD)
      const categoryId = categoriaMap.get(categoryName);
      if (!categoryId) {
        this.logger.warn(
          `Categoría no encontrada: ${categoryName}. Omitiendo...`,
        );
        continue;
      }

      // ⚡ Actualizar directamente sin necesidad de cargar todo el producto
      const result = await this.productRepository.update(
        { name: productName },
        { category: { id: categoryId } },
      );

      if (result.affected > 0) {
        this.logger.log(
          `✅ Producto actualizado: ${productName} → Categoría: ${categoryName}`,
        );
      } else {
        this.logger.warn(`⚠️ Producto no encontrado: ${productName}`);
      }
    }

    return { message: '✅ Actualización de categorías completada' };
  }
}
