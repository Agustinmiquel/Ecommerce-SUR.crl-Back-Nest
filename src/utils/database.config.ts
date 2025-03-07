import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  logging: true,
  type: 'postgres',
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT, 10),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  url: configService.get<string>('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
});
