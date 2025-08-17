import { Module } from '@nestjs/common';
import { AllDocumentsService } from './all-documents.service';
import { AllDocumentsController } from './all-documents.controller';
import { AllDocumentsRepository } from './all-documents.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AllDocumentsController],
  providers: [AllDocumentsService,AllDocumentsRepository, PrismaService],
})
export class AllDocumentsModule {}
