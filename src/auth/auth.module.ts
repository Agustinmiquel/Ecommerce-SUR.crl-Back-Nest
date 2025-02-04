import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from './strategys/google.strategy';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfig } from 'src/utils/Nodemailer.config';
import { UtilsModule } from 'src/utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TwilioProvider } from 'src/utils/twilio.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    TypeOrmModule.forFeature([User]),
    UtilsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, EmailConfig, TwilioProvider],
  exports: [],
})
export class AuthModule {}
