import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';

const mockRepositoryProduct = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((product) =>
      Promise.resolve({ id: Date.now(), ...product }),
    ),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
};

const mockCategoryRepository = {
  findOne: jest.fn().mockResolvedValue(null),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  let categoryRepository: Repository<Category>;
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
          useValue: mockCategoryRepository,
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
  it('should be created a product', () => {
    const product = {
      name: 'product test',
      description: 'description test',
      price: 100,
      stock: 10,
    };
    expect(service.create(productDto)).toEqual({
      id: expect.any(Number),
      ...product,
    });
  });
});
