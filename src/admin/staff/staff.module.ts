import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { PrismaService } from 'src/prisma.service';
import { StaffRepository } from './staff.repository';

@Module({
  controllers: [StaffController],
  providers: [StaffService, PrismaService, StaffRepository],
})
export class StaffModule {}
