import { Module } from '@nestjs/common';
import { StaffTimeLogsService } from './staff-time-logs.service';
import { StaffTimeLogsController } from './staff-time-logs.controller';
import { StaffTimeLogsRepository } from './staff-time-log.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StaffTimeLogsController],
  providers: [StaffTimeLogsService, StaffTimeLogsRepository, PrismaService],
})
export class StaffTimeLogsModule {}