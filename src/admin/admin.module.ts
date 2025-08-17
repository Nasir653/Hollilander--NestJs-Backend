import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { StaffModule } from './staff/staff.module';
import { ClientModule } from './client/client.module';
import { JobsModule } from './jobs/jobs.module';
import { VisaTypeModule } from './visa-type/visa-type.module';
import { StaffDepartmentModule } from './staff-department/staff-department.module';
import { StaffTimeLogsModule } from './staff-time-logs/staff-time-logs.module';
import { AllDocumentsModule } from './all-documents/all-documents.module';
import { StaffAvailabilityModule } from './staff-availability/staff-availability.module';

@Module({
  imports: [
    AuthModule,
    StaffModule,
    ClientModule,
    JobsModule,
    VisaTypeModule,
    StaffDepartmentModule,
    StaffTimeLogsModule,
    AllDocumentsModule,
    StaffAvailabilityModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
