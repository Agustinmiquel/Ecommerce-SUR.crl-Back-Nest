import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

const productDto = {
  name: 'product test',
  description: 'description test',
  price: 100,
  stock: 10,
  codigo: 31231,
  categoryId: '1',
  IsActive: true,
  ImageProduct: 'https://www.google.com',
};

const categoryDto = {
  id: 1,
  name: 'category test',
};

const mockRepositoryProduct = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((product) =>
      Promise.resolve({ id: Date.now(), ...product }),
    ),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockImplementation(({ where: { codigo } }) => {
    if (codigo === 31231) {
      return Promise.resolve({
        ...productDto,
      });
    }
    return Promise.resolve(null);
  }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

const mockCategoryRepository = {
  findOne: jest.fn().mockImplementation(({ where: { name } }) => {
    if (name === '1') {
      return Promise.resolve(categoryDto);
    }
    return Promise.resolve(null);
  }),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepositoryProduct,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository, // Asegura que está aquí
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // crear un producto
  it('should be created a product', async () => {
    const result = await service.create(productDto);
    expect(result).toEqual({
      ...productDto,
    });
  });

  // buscar un producto por codigo
  it('should be return a product', async () => {
    const result = await service.findByCode(productDto.codigo);
    expect(result).toEqual({ ...productDto });
  });

  // Eliminar un producto
  it('should be return a product', async () => {
    const result = await service.remove(productDto.codigo);
    expect(result).toEqual({ affected: 1 });
  });

  // buscar un producto por su categoria
  it('should be return a product', async () => {
    const result = await service.findByCategory(productDto.categoryId);
    expect(result).toEqual([]);
  });

  // buscar todos los productos
  it('should be return all products', async () => {
    const result = await service.findAll(1, 10);
    expect(result).toEqual([]);
  });

  // buscar un producto por su nombre
  it('should be return all products with the same name', async () => {
    const result = await service.searchProduct('product test');
    expect(result).toEqual([]);
  });
});
