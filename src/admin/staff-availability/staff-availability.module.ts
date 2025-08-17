import { Module } from '@nestjs/common';
import { StaffAvailabilityService } from './staff-availability.service';
import { StaffAvailabilityController } from './staff-availability.controller';
import { PrismaService } from 'src/prisma.service';
import { StaffAvailabilityRepository } from './staff-availability.repository';

@Module({
  controllers: [StaffAvailabilityController],
  providers: [StaffAvailabilityService,PrismaService,StaffAvailabilityRepository],
})
export class StaffAvailabilityModule {}
