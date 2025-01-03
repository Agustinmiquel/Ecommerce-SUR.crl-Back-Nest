import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './utils/database.config';
import {
  makeCounterProvider,
  makeGaugeProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { UtilsModule } from './utils/utils.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BrandModule } from './brand/brand.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000,
        };
      },
      isGlobal: true,
    }),
    UtilsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <>"',
      },
    }),
    BrandModule,
  ],
  controllers: [],
  providers: [
    makeCounterProvider({
      name: 'count',
      help: 'metric_help',
      labelNames: ['method', 'origin'] as string[],
    }),
    makeGaugeProvider({
      name: 'gauge',
      help: 'metric_help',
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('/api');
  }
}
