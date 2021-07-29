import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserEntity } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity
    ])
  ],
  exports: [TokenService],
  providers: [TokenService],
  controllers: [TokenController]
})
export class TokenModule {}
