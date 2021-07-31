import { BadRequestException, Injectable, UnauthorizedException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRo, CreateUserDto, LoginUserDto } from './Dto/User.Dto';
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
    this.logger.log('info', `{'SERVICE': 'USER', 'METHOD': 'CREATE', 'USER': ${user.email}}`);

    const isUserPresent = await this.userRepository.findOne({
      email: user.email,
    });

    if (isUserPresent) {
      this.logger.log('error', `{'SERVICE': 'USER', 'METHOD': 'CREATE', 'USER': ${user.email}, 'MESSAGE':'user already present'}`);

      throw new BadRequestException('User already exists');
    }

    const salt = 10;
    user.password = await bcrypt.hash(user.password, salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.log('error', `{'SERVICE': 'USER', 'METHOD': 'CREATE', 'USER': ${user.email}, 'MESSAGE': ${error}}`);

      throw new Error(error);
    }

    try {
      const newUser = await this.userRepository.findOne({ email: user.email });
      const token = await this.tokenService.generateTokens(user as UserEntity);
      
      return this.sanitizeUser(newUser, token);
    } catch (error) {
      this.logger.log('error', `{'SERVICE': 'USER', 'METHOD': 'CREATE', 'USER': ${user.email}, 'MESSAGE': ${error}}`);

      throw new Error(error);
    }
  }

  //user login
  public async login(user: LoginUserDto): Promise<UserRo> {
    this.logger.log('info', `{'SERVICE': 'USER', 'METHOD': 'LOGIN', 'USER': ${user.email}}`);

    const isUserPresent: boolean | UserEntity = await this.userRepository.findOne({email: user.email});
    
    if (!isUserPresent) {
      this.logger.log('info', `{'SERVICE': 'USER', 'METHOD': 'LOGIN', 'USER': ${user.email}, 'MESSAGE':'User not present'}`);

      throw new UnauthorizedException();
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(user.password, isUserPresent.password);

    if (!isPasswordCorrect) {
      this.logger.log('info', `{'SERVICE': 'USER', 'METHOD': 'LOGIN', 'USER': ${user.email}, 'MESSAGE':'password does not match'}`);

      throw new UnauthorizedException();
    }

    try {
      const token = await this.tokenService.generateTokens(isUserPresent as UserEntity);

      return this.sanitizeUser(isUserPresent, token);
    }catch(error) {
      this.logger.log('error', `{'SERVICE': 'USER', 'METHOD': 'LOGIN', 'USER': ${user.email}, 'MESSAGE': ${error}}`);

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
      token: {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      }
    } as UserRo;

  }
}