import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { AdminForgotPasswordDto, AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRespository } from './auth.respository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRespository: AuthRespository,
    private jwtService: JwtService,
  ) {}

  async login(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;

    const normalizedEmail = email.toLowerCase();

    const admin = await this.authRespository.findAdminByEmail(normalizedEmail);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials or password');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.roleId,
    };

    const { password: _, otp: __, ...userWithoutSensitive } = admin;

    return {
      accessToken: this.jwtService.sign(payload),
      user: admin.email,
    };
  }

  async forgotPassword(adminForgotPasswordDto: AdminForgotPasswordDto) {
    const { email, password ,rePassword } = adminForgotPasswordDto;

    const normalizedEmail = email.toLowerCase();

    const admin = await this.authRespository.findAdminByEmail(normalizedEmail);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
     
    if(password !== rePassword){
         throw new ConflictException('Password Should be Same')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateAdmin = await this.authRespository.updateAdminPassword(
      normalizedEmail,
      hashedPassword,
    );

    return {
      message: 'Password updated successfully',
      user: updateAdmin.email,
    };
  }
}
