import {
  IsBoolean,
  IsDecimal,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @MaxLength(15)
  @IsPositive()
  codigo: number;

  @IsNumber()
  @IsNotEmpty()
  @IsDecimal()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  IsActive: boolean;

  @IsString()
  @IsEmpty()
  ImageProduct: string;
}
