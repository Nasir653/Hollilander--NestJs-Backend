import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  @Get('dashboard')
  getDashboard(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Admin dashboard',
      user: user,
    };
  }

  @Post('settings')
  updateSettings(@CurrentUser() user: JwtPayload, @Body() settings: any) {
    return {
      message: 'Settings updated',
      user: user,
      settings: settings,
    };
  }
} 