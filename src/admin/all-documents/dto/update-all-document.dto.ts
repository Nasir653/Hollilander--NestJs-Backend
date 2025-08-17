import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAllDocumentDto } from './create-all-document.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateAllDocumentDto extends PartialType(CreateAllDocumentDto) {
  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
