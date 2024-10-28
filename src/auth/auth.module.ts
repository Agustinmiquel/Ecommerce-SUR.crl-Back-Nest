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

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    TypeOrmModule.forFeature([User]),
    UtilsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, EmailConfig],
  exports: [],
})
export class AuthModule {}
