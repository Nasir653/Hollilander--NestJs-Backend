import { Module } from '@nestjs/common';
import { VisaTypeService } from './visa-type.service';
import { VisaTypeController } from './visa-type.controller';
import { PrismaService } from 'src/prisma.service';
import { VisaTypeRepository } from './visa-type.repository';

@Module({
  controllers: [VisaTypeController],
  providers: [VisaTypeService, PrismaService, VisaTypeRepository],
})
export class VisaTypeModule {}

