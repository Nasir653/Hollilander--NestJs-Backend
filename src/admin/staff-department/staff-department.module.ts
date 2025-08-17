import { Module } from '@nestjs/common';
import { StaffDepartmentService } from './staff-department.service';
import { StaffDepartmentController } from './staff-department.controller';
import { PrismaService } from 'src/prisma.service';
import { staffDepartmentRepository } from './staff-department.repository';

@Module({
  controllers: [StaffDepartmentController],
  providers: [StaffDepartmentService, PrismaService, staffDepartmentRepository],
})
export class StaffDepartmentModule {}
