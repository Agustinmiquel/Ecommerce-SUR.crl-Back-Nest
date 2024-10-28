import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailConfig } from 'src/utils/Nodemailer.config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository,
    private readonly emailService: EmailConfig,
  ) {}

  async findByGooglId(googleId: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { googleId } });
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const userGuardado = await this.userRepository.save(newUser);
    await this.emailService.sendEmail(
      userGuardado.email,
      userGuardado.username,
    );
    return userGuardado;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const newUser = await this.userRepository.update(id, updateUserDto);
    return newUser;
  }

  async remove(id: number) {
    try {
      const user = this.userRepository.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      if (user.is_active) {
        user.is_active = false;
        await this.userRepository.save(user);
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to remove user: ${error.message}`);
    }
  }

  // async sendEmail(email: string) {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     throw new NotFoundException(`User with email ${email} not found`);
  //   }
  //   this.emailService.sendEmailWelcome(user.email, user.username);
  //   return this.logger.log(
  //     `El email de bienvenida fue enviado a ${user.email}`,
  //   );
  // }
}
