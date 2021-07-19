import { BadRequestException, Injectable, UnauthorizedException, Inject, LoggerService, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRo, CreateUserDto, LoginUserDto } from './Dto/UserDto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenService: TokenService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  //saves user to database
  public async create(user: CreateUserDto): Promise<UserRo> {

    const isUserPresent = await this.userRepository.findOne({
      email: user.email,
    });

    if (isUserPresent) {
      throw new BadRequestException('User already exists');
    }

    const salt = 10;
    user.password = await bcrypt.hash(user.password, salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }

    try {
      const newUser = await this.userRepository.findOne({ email: user.email });
      const token = this.tokenService.generate(user as UserEntity);
      
      return this.sanitizeUser(newUser, token);
    } catch (error) {
      throw new Error(error);
    }
  }

  //user login
  public async login(user: LoginUserDto): Promise<UserRo> {
    
    const isUserPresent: boolean | UserEntity = await this.userRepository.findOne({email: user.email});
    
    if (!isUserPresent) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(user.password, isUserPresent.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    try {
      const token = this.tokenService.generate(isUserPresent as UserEntity);

      return this.sanitizeUser(isUserPresent, token);
    }catch(error) {
      throw new Error(error);
    }
  }

  //function to sanitise user response object removes all sensitive data
  private sanitizeUser(user, token): UserRo {
    
    return {
      user: {
        id: user.id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token: token
    } as UserRo;

  }
}
