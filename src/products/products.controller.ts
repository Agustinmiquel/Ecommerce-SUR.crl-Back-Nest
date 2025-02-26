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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 200, description: 'Product has been created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un producto desde un archivo Excel' })
  @ApiResponse({ status: 200, description: 'Products has been created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createForExcel(@UploadedFile() file: Express.Multer.File) {
    await this.productsService.cargaProducts(file);
    return 'Productos cargados';
  }

  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 30) {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @ApiOperation({ summary: 'Buscar un producto por su ID' })
  @ApiResponse({ status: 200, description: 'Return a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Buscar un producto por su categoría' })
  @ApiResponse({ status: 200, description: 'Return a product of category' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('category/:categoryName')
  async findByCategory(@Param('categoryName') categoryName: string) {
    return await this.productsService.findByCategory(categoryName);
  }

  @ApiOperation({ summary: 'Buscar un producto por su código' })
  @ApiResponse({ status: 200, description: 'Return a product' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('code/:code')
  async findByCode(@Param('code') code: number) {
    return await this.productsService.findByCode(code);
  }

  // Buscar por nombre del producto
  @ApiOperation({ summary: 'Buscar producto por el buscador' })
  @ApiResponse({ status: 200, description: 'Return similar products' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('search/:name')
  async searchProduct(@Param('name') name: string) {
    return await this.productsService.searchProduct(name);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Product has been updated' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Product has been deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @ApiOperation({
    summary: 'Actualizar la categoría de los productos desde un archivo Excel',
  })
  @ApiResponse({ status: 200, description: 'Categories have been updated' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('update-category')
  @UseInterceptors(FileInterceptor('file'))
  async actualizarCategoriaProducto(@UploadedFile() file: Express.Multer.File) {
    await this.productsService.actualizarCategoriaProducto(file);
    return 'Categorías actualizadas';
  }
}
