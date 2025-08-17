import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from 'src/prisma.service';
import { JobRepository } from './job.repository';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService, JobRepository],
})
export class JobsModule {}
