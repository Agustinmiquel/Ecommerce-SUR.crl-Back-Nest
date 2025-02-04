import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable, Logger, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository,
    @Inject('TwilioSDK') private readonly twilioClient: Twilio,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async googleCreateUser(profile: any): Promise<any> {
    const { email, firstname, lastname, googleId, phone } = profile;
    let user = await this.userService.findByGooglId(googleId);
    if (!user) {
      const createUserDto: CreateUserDto = {
        email: email,
        username: firstname,
        lastname: lastname,
        googleId: googleId,
        role: 'user',
        facebookId: null,
        phone: phone,
      };
      user = await this.userService.create(createUserDto);
      await this.userRepository.save(user);
    }
    this.logger.log(`User logged in: ${JSON.stringify(user)}`);
    return user;
  }

  //   async facebookLogin(profile: any) {
  //     const { email, firstname, lastname, facebookId, phone } = profile;
  //     let user = await this.userService.findByFacebookId(facebookId);
  //     if (!user) {
  //       const createUserDto: CreateUserDto = {
  //         email: email,
  //         username: firstname,
  //         lastname: lastname,
  //         googleId: null,
  //         role: 'user',
  //         facebookId: facebookId,
  //         phone: phone,
  //       };
  //       user = await this.userService.create(createUserDto);
  //       await this.userRepository.save(user);
  //     }
  //     this.logger.log(`User logged in: ${JSON.stringify(user)}`);
  //     return {
  //       message: 'User information from Facebook',
  //       user,
  //     };
  //   }

  async login(user: any): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_Token: this.jwtService.sign(payload),
      message: 'Login successful',
      user,
    };
  }

  async logout(request: any): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        status: HttpStatus.OK,
      };
    });
  }

  // Generacion del codigo
  async auth2PAVerificationCode(): Promise<number> {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Envio de codigo de verificacion
  async sendSms(to: string, message: string): Promise<void> {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_NUMBER,
        to: to,
      });
      this.logger.log(`Message sent: ${result.sid}`);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async SendCode(id: string, phone: string): Promise<void> {
    const code = await this.auth2PAVerificationCode();
    const user = await this.userService.findOne(id);
    if (!user) {
      this.logger.error(`User with googleId ${id} not found`);
      throw new Error(`User with googleId ${id} not found`);
    }
    user.phone = phone;
    console.log(user.phone);
    await this.userRepository.save(user);
    try {
      const message = `Your verification code is: ${code}`;
      await this.sendSms(phone, message);
      this.logger.log(`Code sent: ${code}`);
    } catch (error) {
      this.logger.error(`Failed to send verification code: ${error.message}`);
    }
    return await this.cacheManager.set(phone, code, 300);
  }
}
