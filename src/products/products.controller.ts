import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createForExcel(@UploadedFile() file: Express.Multer.File) {
    await this.productsService.cargaProducts(file);
    return 'Productos cargados';
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 30) {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('category/:categoryName')
  async findByCategory(@Param('categoryName') categoryName: string) {
    return await this.productsService.findByCategory(categoryName);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: number) {
    return await this.productsService.findByCode(code);
  }

  // Buscar por nombre del producto
  @Post('search')
  async searchProduct(@Body('name') name: string) {
    return await this.productsService.searchProduct(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
