import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserEntity } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token.controller';
import { TokenEntity } from './token.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity
    ]),
  ],
  exports: [TokenService],
  providers: [TokenService],
  controllers: [TokenController]
})
export class TokenModule {}
