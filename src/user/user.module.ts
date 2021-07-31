import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../token/token.service';
import { TokenEntity } from 'src/token/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity
    ])
  ],
  providers: [UserService, TokenService],
  controllers: [UserController],
})
export class UserModule {}
