import { HttpStatus, Injectable, Logger, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    @InjectRepository(User) private readonly userRepository,
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
    return {
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
}
