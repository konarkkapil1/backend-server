import { 
  Body,
  Controller,
  Get,
  Inject,
  Logger,
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
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  //signup route
  @Post('signup')
  @UsePipes(ValidationPipe)
  create(@Body() user: CreateUserDto, @Request() req): Promise<UserRo> {
    this.logger.log('info', `{'METHOD': 'POST', 'ROUTE': 'signup', 'USER': ${user.email} ,'IP': '${req.connection.remoteAddress}'}`);

    return this.userService.create(user);
  }

  //logn route
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: LoginUserDto, @Request() req): Promise<UserRo> {
    this.logger.log('info', `{'METHOD': 'POST', 'ROUTE': 'login', 'USER': ${user.email}, 'IP': '${req.connection.remoteAddress}'}`);

    return this.userService.login(user);
  }

  //testing route
  @Get('protected')
  test(@Request() req) {
    this.logger.log('info', `{'METHOD': 'GET', 'ROUTE': 'protected', 'USER': ${req.user.email}, 'IP': '${req.connection.remoteAddress}'}`);

    return {
      "message": "protected route",
      "user": req.user
    };
  }

}
