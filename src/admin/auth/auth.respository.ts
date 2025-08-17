import { Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthRespository {
  constructor(private prisma: PrismaService) {}

  async findAdminByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email, role: { role: 'Admin' }, status: 'ACTIVE' },
    });
  }

  async updateAdminPassword(email: string, password: string) {
    return await this.prisma.user.update({
      where: { email: email },
      data: { password: password },
    });
  }
}
