import { 
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRo, CreateUserDto, LoginUserDto } from './Dto/UserDto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService
  ) {}

  //signup route
  @Post('signup')
  @UsePipes(ValidationPipe)
  create(@Body() user: CreateUserDto, @Request() req): Promise<UserRo> {
    this.logger.log('http', `CONTROLLER: POST /signup email: ${user.email} ip: ${req.connection.remoteAddress}`);

    return this.userService.create(user);
  }

  //logn route
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: LoginUserDto, @Request() req): Promise<UserRo> {
    this.logger.log('http', `CONTROLLER: POST /login email: ${user.email} ip: ${req.connection.remoteAddress}`);

    return this.userService.login(user);
  }

  //testing route
  @Get('protected')
  test(@Request() req) {
    return {
      "message": "protected route",
      "user": req.user
    };
  }

}
