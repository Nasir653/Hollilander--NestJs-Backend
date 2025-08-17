import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminForgotPasswordDto, AdminLoginDto } from './dto/admin-login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    try {
      return await this.authService.login(adminLoginDto);
    } catch (error) {
      return {
        message: 'Login failed',
        error: error,
      };
    }
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() adminForgotPasswordDto: AdminForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(adminForgotPasswordDto);
    } catch (error) {
      return {
        message: 'Forgot password failed',
        error: error,
      };
    }
  }
}
