import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../utils/decorator/public.decorator';
import { Roles } from '../utils/decorator/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('User')
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiTags('User')
  @Public()
  @Post('register')
  async createUser(@Body() userDto: UserDto) {
    return await this.authService.registerUser(userDto);
  }

  @ApiTags('Manager')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Post('register-admin')
  async createUserAdmin(@Body() userDto: UserDto) {
    return await this.authService.registerUser(userDto, Role.Admin);
  }
}
