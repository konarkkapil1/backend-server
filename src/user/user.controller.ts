import { Body,
    Controller,
    Get,
    Post,
    Request,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRo, CreateUserDto, LoginUserDto } from './Dto/UserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //signup route
  @Post('signup')
  @UsePipes(ValidationPipe)
  create(@Body() user: CreateUserDto): Promise<UserRo> {
    return this.userService.create(user);
  }

  //logn route
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: LoginUserDto): Promise<UserRo> {
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
