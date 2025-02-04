import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Eliminar propiedades no declaradas en DTO
      forbidNonWhitelisted: true,
    }),
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  // Configuracion de Swagger
  const config = new DocumentBuilder()
    .setTitle('Del Sur Ecommerce API Documentation')
    .setDescription('API documentation for Sur Ecommerce')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis-DelSur', app, document);
  // --------------------------
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 3000);
  Logger.log('Server running on http://localhost:3000', 'Bootstrap');
}
bootstrap();
