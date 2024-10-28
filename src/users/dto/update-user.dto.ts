import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'user'])
  @IsOptional()
  role: string;

  @IsNumber()
  @MaxLength(20)
  @IsOptional()
  @IsPositive()
  phone: number;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
