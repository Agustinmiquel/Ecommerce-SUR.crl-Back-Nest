import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  lastname: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  facebookId?: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'user'])
  role: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  phone?: number;
}
