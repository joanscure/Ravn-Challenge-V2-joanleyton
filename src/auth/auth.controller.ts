import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from 'src/utils/decorator/public.decorator';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Request() req: LoginDto) {
    return this.authService.login(req);
  }

  @Roles(Role.Admin)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  async createUser(@Body() userDto: UserDto) {
    return await this.authService.registerUser(userDto);
  }

  @Roles(Role.Admin)
  @Post('register_admin')
  async createUserAdmin(@Body() userDto: UserDto) {
    return await this.authService.registerUser(userDto, Role.Admin);
  }
}
